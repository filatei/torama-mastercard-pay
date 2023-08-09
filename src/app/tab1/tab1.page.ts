import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ActionSheetController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { ImageUploadService } from '../services/image-upload.service';
import { Expense } from '../interfaces/expense';
import { Capacitor } from '@capacitor/core';
import { CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @Input()
  existingExpenseId!: number;
  @ViewChild('imagePicker', { static: false })
  imageInput!: ElementRef;

  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private plt: Platform,
    private actionSheetController: ActionSheetController,
    private expenseService: ImageUploadService,
    private router: Router
  ) {}

  public newExpense: Expense = new Expense();
  public safeReceipt: any;

  ngOnInit() {
    if (this.existingExpenseId) {
      const foundExpense = this.expenseService.getExpense(
        this.existingExpenseId
      );
      this.newExpense = foundExpense!;
    }

    this.setReceiptImage();
  }

  setReceiptImage() {
    if (this.newExpense.id && this.newExpense.receipt.webviewPath) {
      this.safeReceipt = this.sanitizeReceiptImage(
        this.newExpense.receipt.webviewPath
      );
    } else {
      this.safeReceipt = Capacitor.isNativePlatform()
        ? Capacitor.convertFileSrc('assets/image-placeholder.jpg')
        : 'assets/image-placeholder.jpg';
    }
  }

  async captureReceipt(source: CameraSource) {
    const image = await this.expenseService.captureExpenseReceipt(source);
    this.newExpense.receipt.tempPath = image.filepath!;
    this.safeReceipt = image.sanitizedReceiptImage;
  }

  async selectImageSource() {
    // code to present action sheet goes here...
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.captureReceipt(CameraSource.Camera);
        },
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
          this.captureReceipt(CameraSource.Photos);
        },
      },
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: async () => {
          this.imageInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Select File Source',
      buttons,
    });
    await actionSheet.present();

    // Call addImage when the Camera or Photos option is selected
    // this.imagePath = await this.imageUploadService.addImage(CameraSource.Camera);
  }

  uploadFile(event: Event) {
    // const eventObj: any = event as any;
    // const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    // const file: File = target.files[0] as File;

    const eventObj: any = event as any;
    const target: HTMLInputElement | null = eventObj.target as HTMLInputElement;
    const file: File | undefined = target?.files?.[0] as File | undefined;
    if (!file) {
      return;
    }
    console.log(file, 'file', file.type);
    // if file is not an image, show icon for respective file type
    if (!file.type.includes('image')) {
      this.safeReceipt = null;
      return;
    }

    // send file to  backend
    // this.imageUploadService.uploadImage(this.imagePath);

    // this.recForm.get('image').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.safeReceipt = reader.result as string;
      // this.onImage.emit(this.preview); // send image url string to parent component
    };
    reader.readAsDataURL(file);
  }

  async closeModal() {
    if (await this.modalController.getTop()) {
      await this.modalController.dismiss(null);
    }
    this.router.navigateByUrl('/tabs/tab2')
  }

  async updateExpense() {
    const updatedExpense = await this.expenseService.createUpdateExpense(
      this.newExpense
    );
    this.modalController.dismiss(updatedExpense);
  }

  sanitizeReceiptImage(imagePath: string) {
    return this.sanitizer.bypassSecurityTrustUrl(imagePath);
  }
}
