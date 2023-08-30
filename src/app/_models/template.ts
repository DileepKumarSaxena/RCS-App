export interface Template {
    templateCode:string;
    templateType:string;
    templateMsgType:string;
    templeteJson:TemplateJson;
}
export interface TemplateJson {
    botId:number;
    cardTitle:string;
    textMessageContent:string;
    mediaFileOriginalName:string;
    mediaUrl:string;
    suggestions:string;
}