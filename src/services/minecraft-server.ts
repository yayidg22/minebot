import type { TServerData } from "./types";

const SERVER_IP = process.env.MINECRAFT_SERVER_IP!;
const SERVER_PORT = process.env.MINECRAFT_SERVER_PORT!;
const TIMEOUT = 5000;

export const getMinecraftServerDataService =
  async (): Promise<TServerData | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const response = await fetch(
        `https://api.mcstatus.io/v2/status/java/${SERVER_IP}:${SERVER_PORT}`,
        {
          signal: controller.signal,
        }
      );
      const data: TServerData = (await response.json()) as TServerData;
      clearTimeout(timeout);
      return data;
    } catch (error) {
      return null;
    }
  };
