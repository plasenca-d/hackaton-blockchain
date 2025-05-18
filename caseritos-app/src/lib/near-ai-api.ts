const BASE_URL = "https://api.near.ai";

export interface NearAuthData {
  message: any;
  nonce: string;
  recipient: string;
  callback_url: string;
  signature: string;
  account_id: string;
  public_key: string;
}

export interface ThreadMessage {
  content: string;
  role: "user" | "assistant";
  metadata: Record<string, any>;
}

export interface Thread {
  id: string;
  object: string;
  created_at: number;
  metadata: Record<string, any>;
  messages: ThreadMessage[];
}

/**
 * Creates a new thread
 * @param auth - Authentication data
 * @returns The newly created thread
 */
export const createThread = async (
  auth: NearAuthData | null
): Promise<Thread> => {
  const URL = `${BASE_URL}/v1/threads`;

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${JSON.stringify(auth)}`,
    "Content-Type": "application/json",
  };

  const body = {
    messages: [
      {
        content: "string",
        role: "user",
        metadata: {},
      },
    ],
  };

  const newThread = await (
    await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  ).json();

  return newThread;
};

export interface AgentRunResult {
  id: string;
  object: string;
  created_at: number;
  agent_id: string;
  thread_id: string;
  status: string;
  response?: string;
  message_id?: string;
  error?: string;
}

/**
 * Runs an agent on a thread with a message
 * @param auth - Authentication data
 * @param agent - The agent ID
 * @param thread - The thread ID
 * @param message - The message to send
 * @returns The result of running the agent
 */
export const runAgent = async (
  auth: NearAuthData,
  agent: string,
  thread: string,
  message: string
): Promise<AgentRunResult> => {
  const URL = `${BASE_URL}/v1/agent/runs`;

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${JSON.stringify(auth)}`,
    "Content-Type": "application/json",
  };

  const body = {
    agent_id: agent,
    thread_id: thread,
    new_message: message,
    max_iterations: 1,
    record_run: true,
    tool_resources: {},
    user_env_vars: {},
  };

  let agentThread;

  try {
    agentThread = await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  }

  if (!agentThread) {
    throw new Error("Failed to run agent");
  }

  return await agentThread.json();
};

export interface ThreadState {
  object: string;
  data: ThreadMessage[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

/**
 * Fetches the current state of a thread
 * @param auth - Authentication data
 * @param thread - The thread ID
 * @returns The messages in the thread
 */
export const fetchThreadState = async (
  auth: NearAuthData,
  thread: string
): Promise<ThreadState> => {
  const URL = `${BASE_URL}/v1/threads/${thread}/messages?order=desc`;

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${JSON.stringify(auth)}`,
    "Content-Type": "application/json", // Specify content type
  };

  let messages;

  try {
    messages = await fetch(URL, {
      method: "GET",
      headers,
    });
  } catch (error) {
    console.log(error);
  }

  if (!messages) {
    throw new Error("Failed to fetch thread messages");
  }

  return await messages.json();
};
