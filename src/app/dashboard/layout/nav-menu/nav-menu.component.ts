import { ActivatedRoute, Router } from '@angular/router';

import { Component } from '@angular/core';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  constructor(private router:Router,private activatedRoute:ActivatedRoute){}

  logout():void{
    this.router.navigate(['auth','login'],{
      relativeTo:this.activatedRoute,
    })
  }
}
