import { getResolver } from '@kaytrust/did-ethr';
import { Openid4VCIErrors, createJWTVc, createPayloadVCV1, verifyJwtProof } from '@kaytrust/openid4vci';
import { BadRequestException, Body, Controller, Get, Headers, HttpException, HttpStatus, Logger, NotFoundException, Param, Post, Req, ValidationPipe } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Resolver } from 'did-resolver'
import type { Request } from 'express';
import { Public } from 'src/auth/decorators/public-auth.decorator';
import { getFormatterErrorMessages, getNearResolver, siteUrl } from 'src/common/utils/functions';
import type { ConfigEnvVars } from 'src/configs';
import {v4 as uuid} from 'uuid'
import { type IssuerErrorCode, IssuerErrors } from './constants/issuer-errors';
import type { CredentialRequestDto } from './dtos/credential-request.dto';
import type { IssuerService } from './issuer.service';

@Controller('issuer')
export class IssuerController {
  private readonly formatter = getFormatterErrorMessages(IssuerErrors);
	private readonly logger = new Logger(IssuerController.name);
  constructor(
    private readonly issuerService: IssuerService,
    private readonly configService: ConfigService<ConfigEnvVars, true>,
  ) {

  }

  @Get(":issuer_name/credential-offer")
  @Public()
  @ApiParam({
    name: 'issuer_name',
    type: String,
    description: 'issuer_name',
    required: true,
    example: "default",
  })
  credentialOffer(
    @Param('issuer_name') issuer_name: string = 'default',
    @Req() req: Request,
  ) {

    const base_url = siteUrl(req, 'issuer');
    switch (issuer_name) {
      case 'default':
      case this.configService.get('MELON_ISSUER_NAME', { infer: true }):
        return this.issuerService.getCredentialOffer(
          base_url, this.configService.get('MELON_ISSUER_NAME', { infer: true })!
        );

      default:
        throw new NotFoundException('Not Found');
    }
  }

  @Public()
  @Get(':issuer_name/.well-known/openid-credential-issuer')
  @ApiParam({
    name: 'issuer_name',
    type: String,
    description: 'issuer_name',
    required: true,
    example: "default",
  })
  wellKnownCredentialIssuer(
    @Param('issuer_name') issuer_name: string = 'default',
    @Req() req: Request,
  ) {
    const base_url = siteUrl(req, 'issuer');
    switch (issuer_name) {
      case 'default':
      case this.configService.get('MELON_ISSUER_NAME', { infer: true }):
        return this.issuerService.getMelonOpenIdCredentialIssuerWellKnown(
          base_url,
        );

      default:
        throw new NotFoundException('Not Found');
    }
  }

  @Post(":issuer_name/credential/issue")
  @ApiBearerAuth()
  @ApiParam({
    name: 'issuer_name',
    type: String,
    description: 'issuer_name',
    required: true,
    example: "default",
  })
  async issueCredential(
    @Body(new ValidationPipe({transform: true})) request: CredentialRequestDto, @Req() req: Request,
    @Param('issuer_name') issuer_name: string = 'default',
    @Headers("X-Correlation-Id") xCorrelationId?: string,
  ) {

    if (!xCorrelationId) xCorrelationId = uuid()

    this.logger.log("issueCredential.req: " + xCorrelationId + " - " + JSON.stringify(req.body));
    
    const validation = request.isValid(xCorrelationId);

    if (!validation.isValid) {
      const code: IssuerErrorCode = "E8091005";
      const msg = this.formatter(code, validation.message);
      throw new HttpException(Openid4VCIErrors.INVALID_CREDENTIAL_REQUEST + ": " + msg, HttpStatus.BAD_REQUEST);
    }

    const base_url = siteUrl(req, 'issuer');

    let user_did: string|undefined = undefined;

    if (request.proof) {
      if (request.proof.proof_type == "jwt") {
        const audience = this.issuerService.getIssuerUri(base_url, issuer_name)
        const networks = this.configService.get("ethr.networks", {infer: true});
        const resolver = new Resolver({...getResolver({networks}), ...getNearResolver(this.configService)})
        user_did = await verifyJwtProof(request.proof.jwt, {audience, resolver})
      }
    }

    if (!user_did) throw new BadRequestException("Not found user did");

    const issuer_did = this.issuerService.getIssuerDid(issuer_name, user_did.split(":")[1]);

    this.logger.log("issueCredential.issuer_did: " + xCorrelationId + " - " + issuer_did);

    const vc = this.issuerService.getVcForIssuance(req.user!, user_did, issuer_name, issuer_did, request);

    this.logger.log("issueCredential.vc: " + xCorrelationId + " - " + JSON.stringify(vc));

    const payload = createPayloadVCV1(vc);

    this.logger.log("issueCredential.vc.payload: " + xCorrelationId + " - " + JSON.stringify(payload));

    const privateKey = this.issuerService.getIssuerPrivateKey(issuer_name);

    let response: {format: string, credential: string};

    try {
      response = {
        format: request.format,
        credential: await createJWTVc("ethr", {privateKey}, payload, {audience: payload.iss})
      };
    } catch (error) {
      this.logger.error(error)
      throw new BadRequestException(error.message);
    }

    this.logger.log("issueCredential.response: " + xCorrelationId + " - " + JSON.stringify(response));

    return response;
  }
}
