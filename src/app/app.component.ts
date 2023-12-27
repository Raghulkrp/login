import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from './service/shared.service'
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
// import { ShareService } from '../app/atma/share.service';
// import { RemsShareService } from '../app/rems/rems-share.service'
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from './service/notification.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

const isSkipLocationChange = environment.isSkipLocationChange
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  Url = environment.apiURL
  isPremise = false; showModal: boolean;
  timed: boolean = false;
  idleState = 'Not started.';
  CommonTitle = "";
  timedOut = false;
  lastPing?: Date = null;
  countdown: any;
  countdown_Keypress: any;
  adcolor: any;
  count = 100;
  timeout: any;
  currentUrl:any
  // isLogged: boolean = true;
  isLoading: boolean = true;
  title = 'My First App';
  // Loginname = "";
  MODULES: any[];
  MODULES1: any[];
  TeamMembers = [];
  // MyModuleName = "";
  ionName: any;
  isIonName: boolean;
  // isSideNav: boolean;
  menurlList: Array<any>;
  menuId: number;
  subModuleList: any[];
  titleUrls: string;
  urlTitle: any;
  // transactionList = [];
  // masterList = [];
  isMasterList = false;
  isTransactionList = false;
  counter = 10;
  apiTimer: any
  masterUrl: any;
  otpflag = false;
  transactionUrl: any;
  branchViewName: string;
  isbranchView: boolean;
  headerName = '';
  vendorCode: string;
  vendorName: string;
  vendorCode_Name: string;
  premiseCode_Name: string
  premiseCode: string;
  premiseName: string;
  agreementCode: string;
  landLordViewCode: string;
  occupancyViewCode: string;
  premiseDetailsName: string;
  premiseHeaderTitle: string;
  public currentlyClickedCardIndex: number = 0;
  premisesData: any;
  header_Name: string;
  mobileupdationform: any;
  login_id: any;
  editflag = false;
  // mobileupdation=false;
  @ViewChild('closebutton') closebutton;
  login_code: any;
  mobileid: any;
  CommonSummaryNavigator: string;
  remsshareService: any;

  constructor( private shareService: SharedService,private idle: Idle, public cookieService: CookieService, private dataService: DataService, private formBuilder: FormBuilder, private notification: NotificationService,
    public sharedService: SharedService, 
    // private shareService: ShareService,
    private routerneew:Router,
     private SpinnerService: NgxSpinnerService,
    private router: Router, private location: Location,
    //  private remsshareService: RemsShareService,
      private route: ActivatedRoute) {

    // this.isPremise=this.router.getCurrentNavigation().extras.state.isPremise;
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(1);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(900);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');

    idle.onTimeout.subscribe(() => {
      this.idleState = '';
      this.timedOut = true;
      //let message="session expired"
      // alert(message)
      this.idle.stop()

      localStorage.removeItem("sessionData");
      this.cookieService.delete('my-key', '/');
      if (this.sharedService.TokenRefreshintervalId) {
        clearInterval(this.sharedService.TokenRefreshintervalId);
        this.sharedService.TokenRefreshintervalId = null;
        console.log("TokenRefreshintervalId stopped")
      }
      this.sharedService.Loginname = undefined;
      this.sharedService.isLoggedin = false; this.showModal = false;
      this.router.navigateByUrl('/login');
    });

    // idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => {
      // this.idleState = 'session expired in ' + countdown + ' seconds!';
      this.CommonTitle = this.sharedService.MyModuleName;
      this.idleState = '(' + countdown + ' s)';
      this.countdown_Keypress = countdown;
      if (countdown == 1) {
        this.timed = true;
      }
      if (countdown <= 300) {
        this.adcolor = 'red'
      }
      else {
        this.adcolor = 'grey'
      }
      if (countdown === 300) {
        this.dataService.getRefresh()
          .subscribe(result => {
            // console.log("refreshhhh",result)
          })
      }

      if (countdown === 30) {
        this.showModal = true;
      }

    });

    this.reset();

    const data = this.cookieService.get("my-key")
    const item = localStorage.setItem('sessionData', data);
  } //end of constructor

  //Method to handle key press event
  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    // Check for the specific key code you are interested in

    if (event.key) {
      if (this.countdown_Keypress > 30) {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
      }
    }
  }

  ngOnDestroy() {
    if (this.sharedService.TokenRefreshintervalId) {
      clearInterval(this.sharedService.TokenRefreshintervalId);
      this.sharedService.TokenRefreshintervalId = null;
      console.log("TokenRefreshintervalId stopped")
    }
  }
  ngOnInit() {
    
    this.countdown_Keypress = 0;
    this.mobileupdationform = this.formBuilder.group({
      code: [''],
      name: [''],
      mobile_number: [''],
      otp: [''],
      id: ['']
    })

    // this.sharedService.isSideNav = false;

    this.sharedService.ionName.subscribe(data => {
      this.ionName = data;
      this.isIonName = this.ionName === '' ? false : true;
    });
    this.shareService.vendorViewHeaderName.subscribe(result => {
      let data: any = result;
      this.headerName = 'vendorView'
      this.vendorCode = data.code
      this.vendorName = data.name
      this.vendorCode_Name = this.vendorCode + "-" + this.vendorName;
      if (this.vendorCode_Name) {
        this.sharedService.MyModuleName = ""
      }
      if (this.vendorCode_Name === 'undefined-undefined') {
        this.headerName = '';
      }
    })

    this.shareService.branchView.subscribe(res => {
      let data: any = res;
      this.headerName = 'branchView'
      this.branchViewName = data.code + "-" + data.name;
      this.isbranchView = this.branchViewName === '' ? false : true;
      if (this.branchViewName === undefined) {
        this.headerName = ''
      }
      if (this.branchViewName === 'undefined-undefined') {
        this.headerName = ''
      }

    })
    const item = localStorage.getItem('sessionData');
    if (item !== null) {
      let itemValue = JSON.parse(item);
      this.sharedService.Loginname = itemValue.name;
      this.sharedService.isLoggedin = true;
      this.sharedService.loginUserId = itemValue.user_id;
      this.sharedService.loginEmpId = itemValue.employee_id;
      this.getMenuUrl();
    }
    // this.getPremiseData();
  }

  mobile_popu() {
    this.otpflag = false;
    const sessionData = localStorage.getItem("sessionData")
    let logindata = JSON.parse(sessionData);
    this.login_code = logindata.code;
    this.getmobilestatus()
  }
  getmobilestatus() {
    this.dataService.getempmobiedata(this.login_code)
      .then((results: any[]) => {
        let datas = results["data"];
        if (datas) {
          this.mobileupdationform.get('mobile_number').setValue(datas.mobile_number);
          this.mobileupdationform.get('code').setValue(datas.code);
          this.mobileupdationform.get('name').setValue(datas.full_name);
          this.mobileupdationform.get('id').setValue(datas.id);
          this.editflag = true;
        }
      })
  }

  submitForm() {
    this.mobileupdationform.get('otp').setValue('');
    this.otpflag = false;
    let data = localStorage.getItem("location")
    if (data == 'true') {
      this.notification.showWarning("You are trying to login from outside KVB environment.Kindly access the App via KVB environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
      return false
    }
    if (this.mobileupdationform.value.mobile_number.length == 10) {
      this.count = 35;
      this.timeout = setInterval(() => {
        if (this.count > 0) {
          this.count -= 1;
        } else {
          clearInterval(this.timeout);
        }
      }, 500);
      this.dataService.mobiledatapost(this.mobileupdationform.value)
        .subscribe((results) => {
          let datas = results;
          if (results.id) {
            this.otpflag = true;
            this.mobileid = results.id;
            this.notification.showSuccess("Please enter the 8-digit verification code we sent via SMS:(we want to make sure it's you before update ")
          }
          else {
            this.notification.showWarning('failed')
            this.otpflag = false;
          }
        })
    }
  }

  updatemobile() {
    var otpdata = { "otp": this.mobileupdationform.value.otp }
    this.dataService.employeemobilenomicro(otpdata, this.mobileid)
      .then(data => {
        if (data['MESSAGE'] == 'SUCCESS') {
          this.notification.showSuccess("Success")
          this.mobileupdationform.reset()
          this.otpflag = false
          this.closebutton.nativeElement.click();
        } else {
          this.notification.showWarning(data['MESSAGE'])
          this.mobileupdationform.reset()
          this.closebutton.nativeElement.click();
        }
      })
  }


  private getMenuUrl() {
    this.SpinnerService.show()
    this.dataService.getMenuUrl()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let data = results['data'];
        this.sharedService.titleUrl = data[0].url;
        this.sharedService.menuUrlData = data;
        this.menurlList = this.sharedService.menuUrlData;
        this.titleUrls = this.sharedService.titleUrl;
        //this.router.navigateByUrl(this.titleUrls, { skipLocationChange: false });
        this.sharedService.transactionList = [];
        this.sharedService.masterList = [];
        this.menurlList.forEach(element => {
          if (element.type === "transaction") {
            this.sharedService.transactionList.push(element);
          } else if (element.type === "master") {
            this.sharedService.masterList.push(element);
          }
        })
        this.modulerefresh()
      })
  }

  continue() {
    this.showModal = false;

    this.reset();
    this.dataService.getRefresh()
      .subscribe(result => {
        this.reset();
      })
  }

  logout() {
    this.showModal = false;
    this.idleState = '';
    this.timedOut = true;
    this.logout1();
    this.idle.stop()
    localStorage.removeItem("sessionData");
    this.cookieService.delete('my-key', '/');
    // this.isLogged = false;
    // this.Loginname = undefined;
    this.sharedService.Loginname = undefined;
    this.sharedService.isLoggedin = false;
    this.sharedService.MyModuleName = ""
    this.sharedService.Memofrom = ""
    this.headerName = '';
    if (this.sharedService.TokenRefreshintervalId) {
      clearInterval(this.sharedService.TokenRefreshintervalId);
      this.sharedService.TokenRefreshintervalId = null;
      console.log("TokenRefreshintervalId stopped")
    }
    this.router.navigateByUrl('/login');
  }

  private logout1() {
    this.dataService.logout()
      .subscribe((results: any[]) => {
        let datas = results["data"];
      })
  }

  myModuleFunction(modrow, cardIndex) {
    this.shareService.submoduledata.next(modrow.submodule)
    this.isIonName = false;
    this.menuId = modrow.id;
    this.headerName = '';
    this.premiseHeaderTitle = ''
    this.sharedService.MyModuleName = modrow.name;
    this.currentlyClickedCardIndex = cardIndex;
    // console.log("modrow.url", modrow.url)
    // if (modrow.url === "/memosummary") {
    //   // console.log("call1")
    //   this.router.navigate(['ememo', 'memosummary']);
    //   return true;
    // }
    // if (modrow.url === "/rems") {
    //   this.router.navigate(['rems/rems']);
    //   return true;
    // }
    // if (modrow.url === "/rcn") {
    //   this.router.navigate(['prpo/rcn']);
    //   return true;
    // }
    // if (modrow.url === "/bpa") {
    //   this.router.navigate(['prpo/bpa']);
    //   return true;
    // }
    // if (modrow.url === "/pca") {
    //   this.router.navigate(['prpo/pca']);
    //   return true;
    // }
    // if (modrow.url === "/pr") {
    //   this.router.navigate(['prpo/pr']);
    //   return true;
    // }
    // if (modrow.url === "/po") {
    //   this.router.navigate(['prpo/po']);
    //   return true;
    // }
    // if (modrow.url === "/grn") {
    //   this.router.navigate(['prpo/grn']);
    //   return true;
    // }
    // if (modrow.url === "/procurementmaster") {
    //   this.router.navigate(['prpo/procurementmaster']);
    //   return true;
    // }
    // if (modrow.url === "/vendor") {
    //   this.router.navigate(['atma/vendor']);
    //   return true;
    // } if (modrow.url === "/bre") {
    //   this.router.navigate(['bre/bre']);
    //   return true;
    // }
    // if (modrow.url === "/ap") {
    //   this.router.navigate(['ap/ap']);
    //   this.CommonSummaryNavigator = 'AP'
    //   return true;
    // }
    // if (modrow.url === "/provision") {
    //   this.router.navigate(['provision/provision']);
    //   return true;
    // }
    // if (modrow.url === "/vendormaster") {
    //   this.router.navigate(['atma/vendormaster']);
    //   return true;
    // }
    // if (modrow.url === "/master") {
    //   this.router.navigate(['master/master']);
    //   return true;
    // }
    // if (modrow.url === "/pprreport") {
    //   this.router.navigate(['ppr/pprreport']);
    //   return true;
    // }
    // if (modrow.url === "/inward") {
    //   this.router.navigate(['inward/inward']);
    //   return true;
    // }
    // if (modrow.url === "/securityguard") {
    //   this.router.navigate(['SGmodule/securityguardpayment']);
    //   return true;
    // }
    // if (modrow.url === "/securityguardmaster") {
    //   this.router.navigate(['SGmodule/sgmaster']);
    //   return true;
    // }
    // if (modrow.url === "/fa") {
    //   this.router.navigate(['fa/fa']);
    //   this.sharedService.submodulesfa.next(modrow.submodule)

    //   return true;
    // }
    // if (modrow.url === "/tneb/electricityexpensemaster") {
    //   this.router.navigateByUrl('/tneb/electricityexpensemaster');
    //   this.sharedService.submodulestneb.next(modrow.submodule)

    //   return true;
    // }
    // if (modrow.url === "/tneb/electricityexpense") {
    //   this.router.navigateByUrl('/tneb/electricityexpense');
    //   this.sharedService.submodulestneb.next(modrow.submodule)

    //   return true;
    // }
    // if (modrow.url === "/sms") {
    //   this.router.navigate(['sms/smstransaction']);
    //   this.sharedService.submodulessms.next(modrow.submodule)

    //   return true;
    // }
    // if (modrow.url === "/sms/smsmaster") {
    //   this.sharedService.submodulessmsmaster.next(modrow.submodule);
    //   this.router.navigate(['sms/smsmaster']);

    //   return true;
    // }
    // if (modrow.url === "/ta_summary") {
    //   this.router.navigate(['ta/ta_summary']);
    //   return true;
    // }

    // if (modrow.url === "/rmu_summary") {
    //   this.router.navigate(['rmu/rmu_summary']);
    //   return true;
    // }
    // if (modrow.url === "/frs_summary") {
    //   this.router.navigate(['frs/frstransaction']);
    //   return true;
    // }
    // if (modrow.url === "/ProofingMaster") {
    //   this.router.navigate(['proofing/ProofingMaster']);
    //   return true;
    // }
    // if (modrow.url === "/ProofingMap") {
    //   this.router.navigate(['proofing/ProofingMap']);
    //   return true;
    // }
    // if (modrow.url === "/ProofingUpload") {
    //   this.router.navigate(['proofing/ProofingUpload']);
    //   return true
    // }
    // if (modrow.url === "/tamaster") {
    //   this.router.navigate(['ta/ta_master']);
    //   return true;
    // }
    // if (modrow.url === "/documentation") {
    //   this.router.navigate(['documentation/documentation']);
    //   return true;
    // }
    // if (modrow.url === "/los") {
    //   this.router.navigate(['dtpc/los']);
    //   return true;
    // }
    // if (modrow.url === "/ecf") {
    //   this.router.navigate(['ECF/ecf']);
    //   this.CommonSummaryNavigator = 'ECF'
    //   return true;
    // }
    // if (modrow.url === "/inwardMaster") {
    //   this.router.navigate(['inward/inwardMaster']);
    //   return true;
    // }
    // if (modrow.url === "/inwarddocumentsummary") {
    //   this.router.navigate(['inward/inwarddocumentsummary']);
    //   return true
    // }

    // if (modrow.url === "/entry") {
    //   this.router.navigate(['entry/entry']);
    //   return true;
    // }
    // if (modrow.url === "/vehiclefleet") {
    //   this.router.navigate(['vfm/vfm_summary']);
    //   return true;
    // }
    // if (modrow.url === "/interintegrity") {
    //   this.router.navigate(['interintegrity/intertrans']);
    //   return true;
    // }
    // if (modrow.url === "/jvsummary") {
    //   this.router.navigate(['JV/jvsummary']);
    //   this.CommonSummaryNavigator = 'JV'
    //   return true;
    // }
    // if (modrow.url === "/jwsummary") {
    //   this.router.navigate(['JW/jwsummary']);
    //   this.CommonSummaryNavigator = 'JW'
    //   return true;
    // }
    // //  console.log("modrow.url ",modrow.url)
    // if (modrow.url === "/ecfapsummary") {
    //   this.router.navigate(['ECFAP/ecfapsummary']);
    //   this.CommonSummaryNavigator = 'ECFAP'
    //   return true;
    // }
    // if (modrow.url === "/ecfapmakersummary") {
    //   this.router.navigate(['ECFAP/ecfapmakersummary']);
    //   this.CommonSummaryNavigator = 'ECFAP'
    //   return true;
    // }
    // if (modrow.url === "/drs") {
    //   this.router.navigate(['drs/reportbuilder']);
    //   return true;
    // }
    // if (modrow.url === "/crmmain") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crm/mainpage']);
    //             });
      
    //   return true;
    // }
    // if (modrow.url === "/leads") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crm/mainpages']);
    //                   });
      
      
    //   return true;
    // }
    // if (modrow.url === "/campaign") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crm/mainpagess']);
    //                   });
      
    //   return true;
    // }

    // if (modrow.url === "/dashboard") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['vow/dashboard']);
    //                         });
      
    //   return true;
    // }
    // if (modrow.url === "/vow") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['lead/vow_summary']);
    //   });
    //   return true;
    // }
    // if (modrow.url === "/crmreport") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crmreport/reportsmain']);
    //   });
    //   return true;
    // }
    // if (modrow.url === "/crmmaster") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crm/crmmaster']);
    //   });
    //   return true;
    // }
    // if (modrow.url === "/employeetask") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crm/employeetask']);
    //   });
    //   return true;
    // }

    // if (modrow.url === "/product") {
    //   this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['crm/crm/summary']);
    //   });
    //   // this.sharedService.submodulesreport.next(modrow.submodule)
    //   return true;
    // }
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate([modrow.url]);
        });
    // this.router.navigate([modrow.url], { skipLocationChange: isSkipLocationChange });//, 
    this.checkIfCardIsClicked(cardIndex)

  }

  public checkIfCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedCardIndex;
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  backNavigation() {
    this.isIonName = false;
    this.sharedService.ionName.next('')
    this.router.navigate(["/ememo/memosummary"], { skipLocationChange: isSkipLocationChange })
  }

  openNav() {
    if (this.sharedService.isSideNav) {
      document.getElementById("mySidenav").style.width = "200px";
      // document.getElementById("main").style.marginLeft = "12rem";
      this.sharedService.isSideNav = false;
    } else {
      document.getElementById("mySidenav").style.width = "70px";
      // document.getElementById("main").style.marginLeft = "40px";
      this.sharedService.isSideNav = true;
    }
  }
  masterData() {
    let data = this.sharedService.masterList;
    this.masterUrl = data[0].url
    this.sharedService.MyModuleName = data[0].name;
    this.router.navigateByUrl(this.masterUrl, { skipLocationChange: isSkipLocationChange });
    this.isMasterList = true;
    this.isTransactionList = false;
    this.headerName = '';
  }
  homes() {
    let data = this.sharedService.transactionList;
    this.transactionUrl = data[0]?.url
    this.sharedService.MyModuleName = data[0].name;
    this.router.navigateByUrl(this.transactionUrl, { skipLocationChange: isSkipLocationChange });
    this.isTransactionList = true;
    this.isMasterList = false;
    this.headerName = '';
  }

  backBranchView() {
    this.router.navigate(["/atma/vendorView"], { skipLocationChange: isSkipLocationChange })
  }

  backVendor() {
    let vendorName = "Vendor";
    this.sharedService.MyModuleName = vendorName;
    this.headerName = "";
    this.router.navigate(["/atma/vendor"], { skipLocationChange: isSkipLocationChange })
  }
  LOS() {
    this.router.navigate(["/los"], { skipLocationChange: true })
  }

  backpremise() {
    this.premisesData.forEach(element => {
      this.header_Name = element.headerName;
    });
    if (this.premisesData) {
      let index = this.premisesData.length - 1
      let data = this.premisesData[index]
      this.router.navigate([data.routerUrl], { skipLocationChange: isSkipLocationChange });
      this.sharedService.MyModuleName = this.header_Name;
      this.headerName = '';
    }
  }

  reports() {
    this.router.navigate(['/reports'], { skipLocationChange: isSkipLocationChange })

  }
  // getPremiseData() {
  //   this.remsshareService.premiseBackNavigation.subscribe(result => {
  //     if (result != null) {
  //       this.premisesData = result.data
  //       let index = this.premisesData.length - 1
  //       let data = this.premisesData[index]
  //       this.headerName = 'REMS';
  //       this.premiseCode = data.code;
  //       this.premiseName = data.name;
  //       if (data.title == BackNavigationData.premiseView) {
  //         this.premiseCode_Name = this.premiseCode + " (" + this.premiseName + ")";
  //       } else if (data.title == BackNavigationData.agreementView) {
  //         this.premiseCode_Name = this.premiseCode;
  //       } else if (data.title == BackNavigationData.landLordView) {
  //         this.premiseCode_Name = this.premiseCode_Name + " / " + this.premiseName;
  //       } else if (data.title == BackNavigationData.occupancyView) {
  //         this.premiseCode_Name = this.premiseCode_Name + " / " + this.premiseCode;
  //       } else if (data.title == BackNavigationData.premiseDetailsView) {
  //         this.premiseCode_Name = this.premiseCode_Name + " / " + this.premiseName;
  //       } else if (data.title == BackNavigationData.premisesIdentificationView) {
  //         this.premiseCode_Name = this.premiseCode + "(" + this.premiseName + ")";
  //       } else if (data.title == BackNavigationData.premisesDocInfoView) {
  //         this.premiseCode_Name = this.premiseName;
  //       } else if (data.title == BackNavigationData.scheduleView) {
  //         this.premiseCode_Name = this.premiseCode;
  //       } else if (data == "") {
  //         this.sharedService.MyModuleName = "REMS"
  //       }
  //     }
  //   })
  // }
  modulerefresh(){
    this.currentUrl=window.location.hash;
    this.currentUrl = this.currentUrl.startsWith("#") ? this.currentUrl.substring(2) : this.currentUrl;
    if(this.currentUrl !="" && this.currentUrl!=undefined && this.currentUrl!=null){
      let moduleurl=""
      // if (this.currentUrl === 'ememo/memosummary') {
      //   // console.log("call1")
      //   moduleurl="/memosummary"
      // }
      // else if (this.currentUrl === 'rems/rems') {
      //   moduleurl="/rems"
      //   // this.router.navigate(['rems/rems']);
      // }
      // else if (this.currentUrl ==='prpo/rcn' ) {
      //   moduleurl="/rcn"
      // }
      // else if (this.currentUrl === 'prpo/bpa') {
      //   moduleurl="/bpa"
      // }
      // else if (this.currentUrl === 'prpo/pca') {
      //   moduleurl="/pca"
      // }
      // else if (this.currentUrl === 'prpo/pr') {
      //   moduleurl= "/pr"
      // }
      // else if (this.currentUrl=== 'prpo/po') {
      //   moduleurl="/po"
      // }
      // else if (this.currentUrl=== 'prpo/grn') {
      //   moduleurl="/grn"
      // }
      // else if (this.currentUrl=== 'prpo/procurementmaster') {
      //   moduleurl="/procurementmaster"
      // }
      // else if (this.currentUrl=== 'atma/vendor') {
      //   moduleurl="/vendor"
      // } else if (this.currentUrl === 'bre/bre') {
      //   moduleurl="/bre"
      // }
      // else if (this.currentUrl=== 'ap/ap') {
      //   moduleurl="/ap"
      // }
      // else if (this.currentUrl=== 'provision/provision') {
      //   moduleurl="/provision"
      // }
      // else if (this.currentUrl==='atma/vendormaster' ) {
      //   moduleurl="/vendormaster"
      // }
      // else if (this.currentUrl === 'master/master') {
      //   moduleurl="/master"
      // }
      // else if (this.currentUrl==='ppr/pprreport' ) {
      //   moduleurl="/pprreport"
      // }
      // else if (this.currentUrl=== 'inward/inward') {
      //   moduleurl="/inward"
      // }
      // else if( this.currentUrl=== 'SGmodule/securityguardpayment') {
      //   moduleurl="/securityguard"
      // }
      // else if (this.currentUrl===  'SGmodule/sgmaster' ) {
      //   moduleurl="/securityguardmaster"
      // }
      // if (this.currentUrl=== "/fa") {
      //   this.router.navigate(['fa/fa']);
      //   this.sharedService.submodulesfa.next(modrow.submodule)
  
      //   return true;
      // }
      // if (this.currentUrl === "/tneb/electricityexpensemaster") {
      //   this.router.navigateByUrl('/tneb/electricityexpensemaster');
      //   this.sharedService.submodulestneb.next(modrow.submodule)
  
      //   return true;
      // }
      // if (this.currentUrl === "/tneb/electricityexpense") {
      //   this.router.navigateByUrl('/tneb/electricityexpense');
      //   this.sharedService.submodulestneb.next(modrow.submodule)
  
      //   return true;
      // }
      // if (this.currentUrl=== "/sms") {
      //   this.router.navigate(['sms/smstransaction']);
      //   this.sharedService.submodulessms.next(modrow.submodule)
  
      //   return true;
      // }
      // if (this.currentUrl=== "/sms/smsmaster") {
      //   this.sharedService.submodulessmsmaster.next(modrow.submodule);
      //   this.router.navigate(['sms/smsmaster']);
  
      //   return true;
      // }
      // else if (this.currentUrl=== 'ta/ta_summary') {
      //   moduleurl="/ta_summary"
      // }
  
      // else if (this.currentUrl=== "/rmu_summary") {
      //   moduleurl= "/rmu_summary"
      // }
      // else if (this.currentUrl=== 'frs/frstransaction') {
      //   moduleurl="/frs_summary"
      // }
      // else if (this.currentUrl ==='proofing/ProofingMaster' ) {
      //   moduleurl="/ProofingMaster"
      // }
      // else if (this.currentUrl=== 'proofing/ProofingMap') {
      //   moduleurl="/ProofingMap"
      // }
      // else if (this.currentUrl=== 'proofing/ProofingUpload' ) {
      //   moduleurl="/ProofingUpload"
      // }
      // else if (this.currentUrl=== 'ta/ta_master') {
      //   moduleurl="/tamaster" 
      // }
      // else if (this.currentUrl==='documentation/documentation') {
      //   moduleurl="/documentation"
      // }
      // else if (this.currentUrl ==='dtpc/los') {
      //   moduleurl="/los"
      // }
      // else if (this.currentUrl=== 'ECF/ecf') {
      //   moduleurl="/ecf"
      //   this.CommonSummaryNavigator = 'ECF'
      // }
      // else if (this.currentUrl=== 'inward/inwardMaster') {
      //   moduleurl="/inwardMaster"
      // }
      // else if (this.currentUrl==='inward/inwarddocumentsummary') {
      //   moduleurl= "/inwarddocumentsummary"
      // }
  
      // else if (this.currentUrl=== 'entry/entry') {
      //   moduleurl="/entry"
      // }
      // else if (this.currentUrl=== 'vfm/vfm_summary') {
      //   moduleurl="/vehiclefleet"
      // }
      // else if (this.currentUrl=== 'interintegrity/intertrans') {
      //   moduleurl="/interintegrity"
      // }
      // else if (this.currentUrl=== 'JV/jvsummary') {
      //   moduleurl="/jvsummary"
      //   this.CommonSummaryNavigator = 'JV'
      // }
      // else if (this.currentUrl=== 'JW/jwsummary') {
      //   moduleurl="/jwsummary"
      //   this.CommonSummaryNavigator = 'JW'
      // }
      // //  console.log("modrow.url ",modrow.url)
      // else if (this.currentUrl=== 'ECFAP/ecfapsummary') {
      //   moduleurl="/ecfapsummary"
      //   this.CommonSummaryNavigator = 'ECFAP'
      // }
      // else if (this.currentUrl === 'ECFAP/ecfapmakersummary') {
      //   moduleurl="/ecfapmakersummary"
      //   this.CommonSummaryNavigator = 'ECFAP'
      // }
      // else if (this.currentUrl=== 'drs/reportbuilder') {
      //   moduleurl="/drs"
      // }
      // if (this.currentUrl=== 'crm/mainpage') {
      //   moduleurl="/crmmain"
      // }
      // else if (this.currentUrl==='crm/mainpages') {
      //   moduleurl="/leads"
      // }
      // else if (this.currentUrl==='crm/mainpagess') {
      //   moduleurl="/campaign"
      // }
      // else if (this.currentUrl==='vow/dashboard') {
      //   moduleurl="/dashboard"
      // }
      // else if (this.currentUrl=== 'lead/vow_summary') {
      //   moduleurl="/vow"
      // }
      // else if (this.currentUrl=== 'crmreport/reportsmain') {
      //   moduleurl= "/crmreport"
      //   // this.sharedService.submodulesreport.next(modrow.submodule)
      // }
      // else if (this.currentUrl==='crm/crmmaster' ) {
      //   moduleurl="/crmmaster"
      // }
      // else if (this.currentUrl=== 'crm/employeetask') {
      //   moduleurl="/employeetask"
      // }
  
      // else if (this.currentUrl=== 'crm/crm/summary') {
      //   moduleurl="/product"
      //   // this.sharedService.submodulesreport.next(modrow.submodule)
      // }
      if(this.currentUrl=='/login'){
        this.sharedService.transactionList = [];
        this.sharedService.masterList = [];
        this.sharedService.isLoggedin=false
        // this.logout()
      }
      else{
        moduleurl=this.currentUrl
      }
      for (const [index, data] of this.sharedService.transactionList.entries()){
        if(moduleurl===data.url){
          this.currentlyClickedCardIndex=index
          this.shareService.submoduledata.next(data.submodule)
          this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
            // Navigate back to the original route
            this.myModuleFunction(data,this.currentlyClickedCardIndex)
                    });          
          
          return true
  
        }
  
      }
  
    }
    }
    
}

export enum BackNavigationData {
  agreementView = "AgreementView",
  premiseView = "PremiseView",
  landLordView = "LandLordView",
  occupancyView = "OccupancyView",
  premiseDetailsView = "PremiseDetailsView",
  premisesIdentificationView = "PremisesIdentificationView",
  premisesDocInfoView = "PremisesDocInfoView",
  scheduleView = "ScheduleView"
}