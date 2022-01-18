import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { VenueService } from '../venue.service';
declare let google: any;
declare let $: any;
@Component({
  selector: 'app-venue-list-search',
  templateUrl: './venue-list-search.component.html',
  styleUrls: ['./venue-list-search.component.scss']
})
export class VenueListSearchComponent implements OnInit, AfterViewInit {
  @ViewChild('searchTextField') search: ElementRef | undefined;

  searchValue = '';
  mapObject: any = {
    country: '',
    state: '',
    city: '',
    street: '',
    zipcode: '',
    latitude: 0,
    longitude: 0
  };
  venueSearchResult: any;
  costValue: any = 100;
  maxValue: any = 100;
  paramlist: any;
  isSubmitted: any;
  STRINGS: any = localString;
  editCheckBtn = true;
  locationInput = true;
  CurrentLocation = '';
  constructor(private venueService: VenueService,
              private utilityService: UtilityService,
              private route: Router,
              private mapsAPILoader: MapsAPILoader,
              private dialog: MatDialog,
              private sharedService: SharedService) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.selectVenue,
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true
    });
  }

  ngOnInit(): void {
    // this.getSearchVenueList();
    this.handlePermission();
  }
  ngAfterViewInit(): any {
    this.mapsAPILoader.load().then(() => {
    const input = this.search?.nativeElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.mapObject.latitude = place.geometry.location.lat();
      this.mapObject.longitude = place.geometry.location.lng();
      console.log(this.mapObject);
    });
  });
}
  costValueChange(event: any): any {
    this.costValue = event.value;
    this.getSearchVenueList();
  }
  getSearchVenueList(): void {
    if (this.mapObject.latitude === 0 && this.mapObject.longitude === 0) {
      return;
    }
    this.paramlist = {
      latitude: this.mapObject.latitude,
      longitude: this.mapObject.longitude,
      searchValue: this.searchValue,
      miles: this.costValue
    };
    this.utilityService.startLoader();
    this.editCheckBtn = true;
    this.locationInput = true;
    this.venueService.getSearchVenueList(this.paramlist).then((response: any) => {
      this.venueSearchResult = response.data;
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.venueSearchResult = null;
      console.log(error);
      this.dialogopen('No Venue Found, Try With Different Location');
      this.utilityService.routingAccordingToError(error);
    });
  }
  searchVenueByInput(event: any): void {
    if (event.target.value === undefined) {
      this.searchValue = '';
    } else {
      this.searchValue = event.target.value;
    }
    this.getSearchVenueList();
  }
  nevigateVenueDetail(venueid: any): void {
    this.route.navigate(['venue/detail/' + venueid]);
  }
  editVenueLocation(): void {
    this.editCheckBtn = !this.editCheckBtn;
    this.locationInput = !this.locationInput;
  }
  searchVenueLocation(): void {
    this.editCheckBtn = !this.editCheckBtn;
    this.locationInput = !this.locationInput;
    this.getSearchVenueList();
  }
  async getUserCurrentLocation(): Promise<void> {
    const latitude = this.mapObject.latitude;
    const longitude = this.mapObject.longitude;
    if (latitude && longitude) {
      this.mapsAPILoader.load().then(() => {
      const googlemapPosition = new google.maps.LatLng(
        latitude,
        longitude
      );
       // console.log(google_map_position,"google_map_position")
      const googlemapsGeocoder = new google.maps.Geocoder();
      googlemapsGeocoder.geocode(
        { location: googlemapPosition },
        (results: any, status: any) => {
          console.log(results, 'results');
          for (let i = 0; i < results[0].address_components.length; i++) {
            switch (results[0].address_components[i].types[0]) {

              case 'locality':
                this.mapObject.city = results[0].address_components[i].long_name;
                break;
                case 'country':
                  this.mapObject.country = results[0].address_components[i].long_name;
                  break;
                case 'administrative_area_level_1':
                  this.mapObject.state = results[0].address_components[i].long_name;
                  break;
              case 'route':
                this.mapObject.street = results[0].address_components[i].long_name;
                break;
            }
          }
          this.CurrentLocation = this.mapObject.city + ',' + this.mapObject.state + ',' + this.mapObject.country;
          this.getSearchVenueList();
        }
      );
    });
    } else {
     // this.locateMe();
    }
   }
   async getLocation(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // console.log(position.coords.latitude + 'Longitude:' + position.coords.longitude);
          this.mapObject.latitude = position.coords.latitude;
          this.mapObject.longitude = position.coords.longitude;
          this.getUserCurrentLocation();
        }, (error) => {
          // do error handling
          this.utilityService.stopLoader();
          this.dialogopen('Enter Location Manually in Search Location Box');
          console.log(error)
        }, {
          maximumAge: 60000, timeout: 2000,
          enableHighAccuracy: true
        });
      } else {
        this.dialogopen('Geolocation is not supported by this browser');
      }
    });
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '460px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }
  handlePermission(): void {
    this.utilityService.startLoader();
    if( navigator.permissions && (navigator.permissions.query)){
      navigator.permissions.query({name: 'geolocation'}).then((result) => {
        if (result.state === 'granted') {
          this.report(result.state);
         // geoBtn.style.display = 'none';
          this.getLocation();
        } else if (result.state === 'prompt') {
          this.utilityService.stopLoader();
          this.report(result.state);
          this.dialogopen('Please Allow Location Click on Allow');
        } else if (result.state === 'denied') {
          this.report(result.state);
          this.utilityService.stopLoader();
          this.dialogopen('Please Allow Location or Enter Location Manually in Search Location Box');
        }
        result.onchange = (res => {
          this.report(result.state);
  
        });
      });
    }else{
      this.getLocation();
    }
    
  }
  report(state: any): void {
    console.log('Permission ' + state);
  }
}
