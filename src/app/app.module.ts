import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './message/message.component';
import { StudentsComponent } from './students/students.component';
import { HomeComponent } from './home/home.component';
import { ElementsComponent } from './elements/elements.component';
import { IndexComponent } from './index/index.component';
import { TemplateComponent } from './template/template.component';
import { MatTabsModule, MatSidenavModule, MatListModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MessagesComponent,
    MessageComponent,
    StudentsComponent,
    HomeComponent,
    ElementsComponent,
    IndexComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
