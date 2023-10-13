import { Component, OnInit, inject } from '@angular/core';
import { TestDirective } from '../test.directive';

@Component({
  selector: 'cp-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  standalone: true,
  hostDirectives: [TestDirective]
})
export class DemoComponent implements OnInit {
  private testDirective: TestDirective = inject(TestDirective, {self: true})

  ngOnInit() {
    this.logSmth();
  }

  logSmth() {
    this.testDirective.logSmth();
  }
}
