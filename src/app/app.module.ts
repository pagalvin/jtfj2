import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostsService } from './posts/posts.service';

import { KnowledgeDomainsListComponent } from './Admin/KnowledgeDomains/KDList.Component';
import { KnowledgeDomainsService } from './Admin/KnowledgeDomains/KD.Service';
import { KnowledgeDomainsCrudComponent } from './Admin/KnowledgeDomains/KDCrud.Component';

import { FactsService } from './Admin/Facts/Facts.Service';
import { FactsListComponent } from './Admin/Facts/FactsList.Component';
import { FactCrudComponent } from './Admin/Facts/FactCrud.Component';

import { RecordIDsService } from './Framework/Data Services/RecordIDsService';
import { UserService } from './Framework/Users/UserService';
import { ConsoleLog } from './Framework/Logging/ConsoleLogService';

import { ErrorsService } from "./Framework/ErrorHandling/ErrorsService";

const ROUTES = [
  { 
    path: 'Admin/KnowledgeDomains', 
    component: KnowledgeDomainsListComponent
  },
  { 
    path: 'Admin/KnowledgeDomain/:domainID', 
    component: KnowledgeDomainsCrudComponent
  },
  { 
    path: 'Admin/Facts', 
    component: FactsListComponent
  },
  { 
    path: 'Admin/Fact/:factID', 
    component: FactCrudComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    KnowledgeDomainsListComponent,
    KnowledgeDomainsCrudComponent,
    FactCrudComponent,
    FactsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [
    PostsService,
    KnowledgeDomainsService,
    FactsService ,
    RecordIDsService, 
    UserService, 
    ConsoleLog,
    ErrorsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
