export class Person {
    id:number;
	name: string; 
	username: string; 
	email: string;
	password: string;
	isAdmin: string
};

export class Message {
    id: number;
    createdBy: number;
    sentTo: number;
    isRead: string;
    messageContent: string
};