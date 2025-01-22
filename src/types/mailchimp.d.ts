declare module '@mailchimp/mailchimp_marketing' {
  interface MailchimpClient {
    setConfig: (config: { apiKey: string; server: string }) => void;
    ping: {
      get: () => Promise<{ health_status: string }>;
    };
    lists: {
      addListMember: (listId: string, data: any) => Promise<any>;
      getAllLists: () => Promise<{ lists: Array<{ id: string; name: string }> }>;
    };
  }

  const mailchimp: MailchimpClient;
  export default mailchimp;
} 