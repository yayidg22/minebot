export type TServerData = {
  online: true;
  host: string;
  port: number;
  ip_address: string;
  eula_blocked: false;
  retrieved_at: number;
  expires_at: number;
  srv_record: null;
  version: {
    name_raw: string;
    name_clean: string;
    name_html: string;
    protocol: number;
  };
  players: {
    online: number;
    max: number;
    list: [];
  };
  motd: {
    raw: string;
    clean: string;
    html: string;
  };
  icon: string;
  mods: [];
  software: null;
  plugins: [];
};
