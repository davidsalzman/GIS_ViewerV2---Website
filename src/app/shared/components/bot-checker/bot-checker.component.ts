import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  standalone: true,
  selector: 'bot-checker',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './bot-checker.component.html',
  styleUrls: ['./bot-checker.component.scss']
})
export class BotCheckerComponent implements OnInit, OnDestroy {
  @Input() minNumbers = 3;
  @Input() maxNumbers = 7;
  @Input() resetNumbers = new EventEmitter<void>();
  @Input() resetForm = new EventEmitter<void>();

  @Input() valid = false;
  @Output() validChange = new EventEmitter<boolean>();

  public enteredNumbers: string | null | undefined;
  public randomNumbers: number[] = [];

  private subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadRandomNumbers();
    this.onCheckAntiBot();

    this.subscriptions.push(this.resetNumbers.subscribe(() => {
      this.loadRandomNumbers();
      this.onCheckAntiBot();
    }));

    this.subscriptions.push(this.resetForm.subscribe(() => {
      this.enteredNumbers = null;
      this.onCheckAntiBot();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public onCheckAntiBot(): void {
    this.valid = this.isAnitBotValid();
    this.validChange.next(this.valid);
  }

  private loadRandomNumbers(): void {
    const numberOfRandomNumbers = Math.floor(Math.random() * 4) + 3;

    this.randomNumbers = [];
    for (let i = 0; i <= numberOfRandomNumbers; i++) {
      this.randomNumbers.push(Math.floor(Math.random() * 9) + 1);
    }
  }

  private isAnitBotValid(): boolean {
    if (!this.enteredNumbers) return false;

    const sNumbers = this.enteredNumbers.split('');

    if (sNumbers.length != this.randomNumbers.length) return false;

    for (let i = 0; i < this.randomNumbers.length; i++) {
      const randomNumber = this.randomNumbers[i];
      const inputtedNumber = sNumbers[i];

      if (randomNumber !== +inputtedNumber) return false;
    }

    return true;
  }
}
