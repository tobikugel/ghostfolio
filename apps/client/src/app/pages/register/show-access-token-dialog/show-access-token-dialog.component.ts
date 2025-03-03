import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'gf-show-access-token-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./show-access-token-dialog.scss'],
  templateUrl: 'show-access-token-dialog.html',
  standalone: false
})
export class ShowAccessTokenDialog {
  public isCreateAccountButtonDisabled = true;
  public disclaimerChecked = false;

  public constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public onChangeDislaimerChecked() {
    this.disclaimerChecked = !this.disclaimerChecked;
  }

  public enableCreateAccountButton() {
    this.isCreateAccountButtonDisabled = false;
  }
}
