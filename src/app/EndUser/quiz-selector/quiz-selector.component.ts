import { Component, OnInit } from '@angular/core';
import { QuizTemplatesService } from '../../Admin/QuizTemplates/QT.Service';

@Component({
  selector: 'jtfj-quiz-selector',
  templateUrl: './quiz-selector.component.html',
  styleUrls: ['./quiz-selector.component.css']
})
export class QuizSelectorComponent implements OnInit {

  public get AllQuizTemplates() { return this.qtService.AllQuizTemplates }

  constructor(private qtService: QuizTemplatesService) { }

  ngOnInit() {

    this.qtService.LoadAll();

  }

}
