import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, JwtService } from '@app/_services';
import { ChatService } from '@app/services/chat.service';
import { STATUSES, User } from 'src/app/_models/chat';
import { USERS } from 'src/app/_models/chat-data';
@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.scss']
})

export class ChatAppComponent {
  statuses = STATUSES;
  activeUser;
  users: User[];
  filteredUsers: User[] = [];
  currentUser: any;
  searchQuery: string = '';
  expandStatuses = false;
  selectedUserMessages: any[] = [];
  selectedBlacklistMsisdn: string;
  expanded = false;
  messageReceivedFrom = {
    img: 'https://cdn-icons-png.flaticon.com/512/811/811476.png',
    name: 'Media bot'
  }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private jwtserivce: JwtService,
    private chatservice: ChatService,
    private cdr: ChangeDetectorRef

  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.setUserActive(USERS[0])
    this.scrollToBottom();
    this.fetchContactData();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  isUserMatchingSearch(user: any): boolean {
    if (!this.searchQuery) {
      return true;
    }

    const isMatching = user.blacklistMsisdn.toLowerCase().includes(this.searchQuery.toLowerCase());
    // console.log(`User: ${user.blacklistMsisdn}, Search Query: ${this.searchQuery}, Is Matching: ${isMatching}`);
    return isMatching;
  }

  handleBlacklistMsisdnClick(blacklistMsisdn: string) {
    console.log('Clicked =', blacklistMsisdn)
    this.selectedBlacklistMsisdn = blacklistMsisdn;
    this.cdr.detectChanges();
  }

  getUniqueBlacklistMsisdns(users) {
    return Array.from(new Set(users.map(user => user.blacklistMsisdn)));
  }

  fetchContactData() {
    this.chatservice.fetchUsers('Niro').subscribe((data: any) => {
      if (data.msg === 'Record Founded.') {
        this.users = data.blacklist;
      }
    });
  }

  applySearchFilter() {
    this.users = this.users.filter((user) =>
      user.blacklistMsisdn.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addNewMessage(inputField) {
    const val = inputField.value?.trim();
    if (val.length && this.activeUser) {

      if (!this.activeUser.messages) {
        this.activeUser.messages = [];
      }

      this.activeUser.messages.push({ type: 'sent', message: val });
      if (this.activeUser.ws) {
        this.activeUser.ws.send(JSON.stringify({ id: this.activeUser.id, message: val }));
      }
    }
    inputField.value = '';
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  setUserActive(user) {
    this.activeUser = user;
    this.selectedUserMessages = user.blacklist;
  }

  onWSEvent(event, status: STATUSES) {
    this.users.forEach(u => u.ws === event.target ? u.status = status : null)
  }

}


