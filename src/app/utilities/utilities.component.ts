// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Idle } from '@ng-idle/core';
// import { data } from 'jquery';
// import { CookieService } from 'ngx-cookie-service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { environment } from 'src/environments/environment';
// // import { ShareService } from '../atma/share.service';
// import { DataService } from '../service/data.service';
// import { NotificationService } from '../service/notification.service';
// import { SharedService } from '../service/shared.service';
// const isSkipLocationChange = environment.isSkipLocationChange

// @Component({
//   selector: 'app-utilities',
//   templateUrl: './utilities.component.html',
//   styleUrls: ['./utilities.component.scss']
// })
// export class UtilitiesComponent implements OnInit {
//   mobileupdationform: any;
//   syncform:FormGroup;
//   otpflag = false;
//   editflag=false;
//   count = 100;
//   timeout: any;
//   login_code: any;
//   mobileid: any;
//   mobileupdate=false;
//   checked=false;
//   first=false;
//   monosync=false;
//   changedmobno = true;
//   act_type:any;
//   constructor(private idle: Idle, public cookieService: CookieService, private dataService: DataService, private formBuilder: FormBuilder, private notification: NotificationService,
//     public sharedService: SharedService, 
//     // private shareService: ShareService,
//      private SpinnerService: NgxSpinnerService,
//     private router: Router, private route: ActivatedRoute) {
//     }

//   ngOnInit(): void {
//     this.mobileupdationform = this.formBuilder.group({
//       code: [''],
//       name: [''],
//       mobile_number: [''],
//       otp: [''],
//       id: [''],
//       type:['']
//     })
//     this.syncform = this.formBuilder.group({
//       masterid: new FormControl(''),
//       name: new FormControl('')
//     })

//     this.mobile_popu()
//   }
//   mobile_popu() {
//     this.otpflag = false;
//     const sessionData = localStorage.getItem("sessionData")
//     let logindata = JSON.parse(sessionData);
//     this.login_code = logindata.code;
//     this.getmobilestatus()
//   }
//   getmobilestatus() {
//     this.dataService.getempmobiedata(this.login_code)
//       .then((results: any[]) => {
//         let datas = results["data"];
//         if (datas != {}) {
//           this.mobileupdationform.get('mobile_number').setValue(datas.mobile_number);
//           this.mobileupdationform.get('code').setValue(datas.code);
//           this.mobileupdationform.get('name').setValue(datas.full_name);
//           this.mobileupdationform.get('id').setValue(datas.id);
//           if(datas.mobile_number == 0 || datas.mobile_number == null || datas.mobile_number == undefined)
//           {
//             this.act_type="INSERT"
//           }
//           else
//           {
//             this.act_type="UPDATE"
//           }
//           this.editflag = true;
//         }
//       })
//   }

//   submitForm() {
//     this.dataService.checkmobnoexist({"mobile_number":this.mobileupdationform.value.mobile_number})
//     .subscribe((results) => {
//       console.log("res",results)
//       if(results['MESSAGE'] == 'Not_Exist'){          
//         this.mobileupdationform.get('otp').setValue('');
//         this.otpflag = false;
//         let data = localStorage.getItem("location")
//         if (data == 'true') {
//           this.notification.showWarning("You are trying to login from outside KVB environment.Kindly access the App via KVB environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
//           return false
//         }
//         if (this.mobileupdationform.value.mobile_number.length == 10) {
//           this.count = 35;
//           this.timeout = setInterval(() => {
//             if (this.count > 0) {
//               this.count -= 1;
//             } else {
//               clearInterval(this.timeout);
//             }
//           }, 500);
//           this.dataService.mobiledatapost(this.mobileupdationform.value)
//             .subscribe((results) => {
//               let datas = results;
//               if (results.id) {
//                 this.otpflag = true;
//                 this.mobileid = results.id;
//                 this.notification.showSuccess("Please enter the 8-digit verification code we sent via SMS:(we want to make sure it's you before update ")
//               }
//               else {
//                 this.notification.showWarning('failed')
//                 this.otpflag = false;
//               }
//             })
//         }
//       }
//       else
//       {
//         var answer = window.confirm(results['MESSAGE']);
//             if (answer) {
//               this.mobileupdationform.get('otp').setValue('');
//                 this.otpflag = false;
//                 let data = localStorage.getItem("location")
//                 if (data == 'true') {
//                   this.notification.showWarning("You are trying to login from outside KVB environment.Kindly access the App via KVB environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
//                   return false
//                 }
//                 if (this.mobileupdationform.value.mobile_number.length == 10) {
//                   this.count = 35;
//                   this.timeout = setInterval(() => {
//                     if (this.count > 0) {
//                       this.count -= 1;
//                     } else {
//                       clearInterval(this.timeout);
//                     }
//                   }, 500);
//                   this.dataService.mobiledatapost(this.mobileupdationform.value)
//                     .subscribe((results) => {
//                       let datas = results;
//                       if (results.id) {
//                         this.otpflag = true;
//                         this.mobileid = results.id;
//                         this.notification.showSuccess("Please enter the 8-digit verification code we sent via SMS:(we want to make sure it's you before update ")
//                       }
//                       else {
//                         this.notification.showWarning('failed')
//                         this.otpflag = false;
//                       }
//                     })
//               }
//             }
//             else {
//               return false;
//             }  
//       }
//     })
//   }

//   updatemobile() {
//     var otpdata = { "otp": this.mobileupdationform.value.otp,"type":this.act_type }
//     this.dataService.employeemobilenomicro(otpdata, this.mobileid)
//       .then(data => {
//         if (data['MESSAGE'] == 'SUCCESS') {
//           this.notification.showSuccess("Success")
//           // this.mobileupdationform.reset()
//           this.router.navigate(['utilities/mobileupdate'], { skipLocationChange: isSkipLocationChange })
//           this.otpflag = false
//           // this.closebutton.nativeElement.click();
//         } else {
//           this.notification.showWarning(data['MESSAGE'])
//           // this.mobileupdationform.reset()
//           this.router.navigate(['utilities/mobileupdate'], { skipLocationChange: isSkipLocationChange })
//           // this.closebutton.nativeElement.click();
//         }
//       })
//   }
//   assetBtn(){
//      this.mobileupdate=true;
//      this.monosync=false;
//   }
//   numberOnly(event): boolean {
//     const charCode = (event.which) ? event.which : event.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//       return false;
//     }
//     return true;
//   }
//   empmonochange()
//   {
//       this.changedmobno = false
//   }
//   syncreportBtn(){
//     this.mobileupdate=false;
//     this.monosync=true;
//     this.checked=false;
//   }
//   mstsync_reportdownload(){
//     if(this.syncform.get('masterid').value==undefined||this.syncform.get('masterid').value==''){
//       this.checked=true;
//     }
//     this.first=true;
//     this.dataService.mstsync_reportdownload(1).subscribe(fullXLS=>{
//       this.first=false;
//       if(fullXLS['type']=='application/json'){
//         this.notification.showWarning("INVALID DATA");
//       }
//       else{
//       let binaryData = [];
//       binaryData.push(fullXLS)
//       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
//       let link = document.createElement('a');
//       link.href = downloadUrl;
//       let date: Date = new Date();
//       link.download = 'Master Sync Report'+ date +".xlsx";
//       link.click();
//       }
//     },
//     (error)=>{
//       this.first=false;
//     })
//   }
// }
