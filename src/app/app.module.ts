import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Imports commented out for brevity
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostsService } from './posts/posts.service';
import { KnowledgeDomainsListComponent } from './Admin/KnowledgeDomains/KDList.Component';
import { KnowledgeDomainsService } from './Admin/KnowledgeDomains/KD.Service';
import { KnowledgeDomainsCrudComponent } from './Admin/KnowledgeDomains/KDCrud.Component';
import { RecordIDsService } from './Framework/Data Services/RecordIDsService';
import { UserService } from './Framework/Users/UserService';
import { ConsoleLog } from './Framework/Logging/ConsoleLogService';

// Define the routesn
const ROUTES = [
  { 
    path: 'Admin/KnowledgeDomains', 
    component: KnowledgeDomainsListComponent
  },
  { 
    path: 'Admin/KnowledgeDomain/:domainID', 
    component: KnowledgeDomainsCrudComponent
  },

  // {
  //   path: '**',
  //   redirectTo: "/homepage",
  // }
  // {
  //   path: '',
  //   redirectTo: 'posts',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'posts',
  //   component: PostsComponent
  // }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    KnowledgeDomainsListComponent,
    KnowledgeDomainsCrudComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [PostsService, KnowledgeDomainsService, RecordIDsService, UserService, ConsoleLog],
  bootstrap: [AppComponent]
})
export class AppModule { }
