import { Resolver, getResolver } from '@kaytrust/did-ethr';
import {type JwtCredentialPayload, type JwtPresentationPayload, ProofTypeJWT, VerifiedPresentation} from '@kaytrust/prooftypes'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as jose from 'jose'
import { generarHash, getNearResolver } from 'src/common/utils/functions';
import type { ConfigEnvVars } from 'src/configs';
import type { SocketService } from 'src/socket/services/socket.service';
import type { Repository } from 'typeorm';
import { CreateVerifyDto } from './dtos/create-verify.dto';
import type { VerifyDto } from './dtos/verify.dto';
import { Verify } from './entities';
import { VpEvalError } from './errors/vp-eval.error';
import { sanitizeVerify } from './helpers/sanitize-user';

@Injectable()
export class VerifierService {
    private readonly logger = new Logger(VerifierService.name);
    constructor(
        private configService: ConfigService<ConfigEnvVars, true>,
        @InjectRepository(Verify)
        private verifyRepository: Repository<Verify>,
        private readonly socketService: SocketService,
    ) {}

    async evalVpToken(vp_token: string, xCorrelationId: string) {
        const networks = this.configService.get("ethr.networks", {infer: true});
        const resolver = new Resolver({...getResolver({networks}), ...getNearResolver(this.configService)})
        const proof = new ProofTypeJWT({verifyOptions: {policies: {aud: false}}}, true)
        const resolution = await proof.verifyProof(vp_token, {resolver})
        // this.logger.log("evalVpToken.resolution: " + xCorrelationId + " - " + JSON.stringify(resolution));
        if (!resolution.verified) throw new VpEvalError("Failed on verified vp: " + xCorrelationId);

        const payload = jose.decodeJwt(vp_token) as JwtPresentationPayload
        const issuer = payload.iss;
        const vp = payload.vp;
        const credential = [vp.verifiableCredential].flat().find((cred)=>{
        const cred_payload = jose.decodeJwt(cred as string) as JwtCredentialPayload
            return !!cred_payload.vc?.type.includes('AcmeAccreditation') && !!cred_payload.vc?.type.includes('VerifiableCredential')
        })
        if (!credential) throw new VpEvalError(`VerifiableCredential, AcmeAccreditation not found (${xCorrelationId})`);

        const cred_payload = jose.decodeJwt(credential as string) as JwtCredentialPayload
        const vc_sub = cred_payload.sub;

        if (issuer != vc_sub) throw new VpEvalError(`Inconsistent VC on VP, different DID owner (${xCorrelationId})`);


        const proof_vc = new ProofTypeJWT({verifyOptions: {policies: {aud: false}}}, false)
        const resolution_vc = await proof_vc.verifyProof(credential as string, {resolver})
        
        if (!resolution_vc.verified) throw new VpEvalError("Failed on verified vc AcmeAccreditation: " + xCorrelationId);

        const name = cred_payload.vc.credentialSubject.name
        const email = cred_payload.vc.credentialSubject.email

        const display_name = name ? name : email;

        const createDto = plainToInstance(CreateVerifyDto, {
            did: issuer, email, name: display_name, 
            vpHash: generarHash(vp_token),
            verified: true,
        } as CreateVerifyDto);

        const verifyDto = await this.create(createDto);

        this.socketService.vpInserted(verifyDto);
    
        return verifyDto;
    }



  async create(createVerifyDto: CreateVerifyDto): Promise<VerifyDto> {
    try {
      const verify = this.verifyRepository.create(createVerifyDto);
      return sanitizeVerify(await this.verifyRepository.save(verify));
    } catch (error) {
      this.logger.error(`Failed to create verify: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create verify');
    }
  }

  async findAll(limit = 30): Promise<VerifyDto[]> {
    try {
      const vps = await this.verifyRepository.find({order: {
        updatedAt: 'DESC',
      }, take: limit});
      return vps.map((vp) => sanitizeVerify(vp));
    } catch (error) {
      this.logger.error(
        `Failed to retrieve all verifies: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(error);
    }
  }
}
