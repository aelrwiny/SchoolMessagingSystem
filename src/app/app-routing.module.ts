import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {StudentsComponent} from './students/students.component';
import {MessagesComponent} from './messages/messages.component';
import {MessageComponent} from './message/message.component';

import {ElementsComponent} from './elements/elements.component';
import {IndexComponent} from './index/index.component';
import {TemplateComponent} from './template/template.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'studentLogin', component: LoginComponent},
    {path: 'adminLogin', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'students', component: StudentsComponent},
    {path: 'messages', component: MessagesComponent},
    {path: 'message/:id/:username', component: MessageComponent},
    {path: 'message/:messageId', component: MessageComponent},
    {path: 'elements', component: ElementsComponent},
    {path: 'index', component: IndexComponent},
    {path: 'template', component: TemplateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
