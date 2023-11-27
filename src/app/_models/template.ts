export interface Template {
    templateCode:string;
    templateType:string;
    templateMsgType:string;
    templateJson:TemplateJson;
}

export interface TemplateJson {
    botId:number;
    cardTitle:string;
    textMessageContent:string;
    mediaFileOriginalName:string;
    mediaUrl:string;
    suggestions:string;
}