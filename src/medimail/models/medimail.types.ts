
export enum MedimailActions {
  HELLO = 'hello',
  SEND = 'send',
  OPEN = 'open',
  CHECKBOX = 'checkbox',
}

type Attachment = {
  name: string;
  content: string;
};

type SendAttachments = {
  attachment1?: Attachment;
  attachment2?: Attachment;
  attachment3?: Attachment;
  attachment4?: Attachment;
  attachment5?: Attachment;
};

export type MSSSoapResult = {
  return: {
    $value: string;
  };
  sendResult: {
    $value: string;
  };
  openReturn: {
    $value: string;
  };
  checkboxReturn: {
    $value: string;
  };
};

export type FormattedMSSResponse = {
  formatted: MSSSoapResult;
  xml: string;
  error: Error | null;
};

export type SendMessageOptions = {
  title: string;
  message: string;
  signatories: string[];
  recipients?: string[];
  attachments?: SendAttachments;
};

export type HelloResult = {
  hello: {
    status: string;
    hello: string;
  };
};

export type SendResult = {
  webisend: {
    status: string,
    author: string,
    signatories: string,
    ignore: null,
    title: string,
    refs: {
      mss: string[] | string
    },
  }
}

export type Signatory = {
  firstname: string;
  lastname: string;
  email: string;
}

type Recipient = {
  firstname: string;
  lastname: string;
  email: string;
}

export type OpenResult = {
  webiopen: {
    status: string,
    call: string,
    author: {
      firstname: string,
      lastname: string,
      email: string,
    },
    begindate: string,
    enddate: string | null,
    signatories: Signatory[],
    recipients: Recipient[],
    title: string,
    content: string,
    nbattachments: string,
    attachments: Attachment[],
    'message-id': string,
    inReplyTo: string | null,
    references: string | null,
    replyTo: string,
  }
}

type CheckboxMessage = {
  ref: string,
  author: Recipient,
  dtcreate: string,
  signatories: Signatory[],
  recipients: null,
  title: string,
}


export type CheckboxReturn = {
  webicheckbox: {
    status: string,
    user: string,
    begindate: string,
    enddate: string,
    inputs: {
      kvp: CheckboxMessage[]
    },
    outputs: {
      kvp: CheckboxMessage[]
    },
  }
}

export enum CheckboxType {
  ALL_MESSAGES = 1,
  RECEIVED_MESSAGES = 2,
  SENT_MESSAGES = 3,
}
