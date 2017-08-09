import { componentModuleUrl } from '@angular/compiler';
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

import { QuizTemplatesListComponent } from './Admin/QuizTemplates/QTList.Component';
import { QuizTemplatesService } from './Admin/QuizTemplates/QT.Service';
import { QTCrudComponent } from './Admin/QuizTemplates/QTCrud.Component';

import { QICrudComponent } from './EndUser/QuizInstances/QI.Crud.Component';
import { QIService } from './EndUser/QuizInstances/QI.Service';

import { RecordIDsService } from './Framework/Data Services/RecordIDsService';
import { UserService } from './Framework/Users/UserService';
import { ConsoleLog } from './Framework/Logging/ConsoleLogService';

import { ErrorsService } from "./Framework/ErrorHandling/ErrorsService";
import { QuizSelectorComponent } from './EndUser/quiz-selector/quiz-selector.component';

const ROUTES = [
  { path: 'Admin/KnowledgeDomains', component: KnowledgeDomainsListComponent},
  { path: 'Admin/KnowledgeDomain/:domainID', component: KnowledgeDomainsCrudComponent},
  { path: 'Admin/Facts', component: FactsListComponent },
  { path: 'Admin/Fact/:factID', component: FactCrudComponent },
  { path: 'Admin/QuizTemplates', component: QuizTemplatesListComponent},
  { path: 'Admin/QuizTemplate/:quizTemplateID', component: QTCrudComponent},
  { path: 'TakeAQuiz/:quizTemplateID', component: QICrudComponent},
  { path: '', component: QuizSelectorComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    KnowledgeDomainsListComponent,
    KnowledgeDomainsCrudComponent,
    FactCrudComponent,
    FactsListComponent,
    QTCrudComponent,
    QuizTemplatesListComponent,
    QICrudComponent,
    QuizSelectorComponent,
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
    ErrorsService,
    QuizTemplatesService,
    QIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
