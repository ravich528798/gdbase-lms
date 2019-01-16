import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {URL_GET_USER} from 'src/app/api';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-scorm-player',
  templateUrl: './scorm-player.component.html',
  styleUrls: ['./scorm-player.component.scss']
})
export class ScormPlayerComponent implements OnInit {
  public userData: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  public _VERSION = "2.2.20130225";
  // Should we skip the automatic manifest check?
  public skipManifestCheck = false;

  // The SCO's *default* launch file
  public launchFile = 'default.htm';  

  // The *default* name of the cookie to be used within this session
  public cookieName = 'SimpleAPI_Data_' + this._VERSION;

  // Should the *default* cookie name use the name of the parent folder instead?
  public useParentFolderAsCookieName = true;

  // Shall we close SCO on LMSFinish?
  public closeOnFinish = true;

  // The width of the SCO window when launched
  public wWidth = 1024;

  // The height of the SCO window when launched
  public wHeight = 768;

  // SCO window default features
  public wToolbar = false;
  public wTitlebar = false;
  public wLocation = true;
  public wStatus = true;
  public wScrollbars = true;
  public wResizable = true;
  public wMenubar = false;

  // Default value for the search string option
  public defaultSearchString = '?embedded=true';

  // Default values for the custom API key/value pair injection option
  public defaultCustomApiKey = 'SomeCustomKey';
  public defaultCustomApiValue = 'SomeCustomValue';

  // Default state of the SCORM API if one cannot be pulled from the
  // data cookie.  Change values below if you wish to test a SCO
  // being launched in a specific state.  Ensure you reset it back
  // to the defaults already present below when finished testing
  // to avoid the appearance of unexpected behaviors within the SCO
  // in subsequent tests...
  public initialState = {
    'cmi.core._children': 'student_id,student_name,lesson_status,lesson_location,lesson_mode,score,credit,entry,exit,session_time,total_time',
    'cmi.core.score._children': 'raw',
    'cmi.core.student_id': 'godwin_007',
    'cmi.core.student_name': 'Godwin VC',
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.score.raw': '',
    'cmi.core.lesson_location': '',
    'cmi.suspend_data': '',
    'cmi.core.session_time': '0000:00:00.00',
    'cmi.core.credit': 'credit',
    /* "credit" or "no-credit" */
    'cmi.core.entry': 'ab-initio',
    /* "resume" or "ab-initio" */
    'cmi.core.lesson_mode': 'normal',
    /* "browse",  "normal" or "review" */
    'cmi.core.exit': '' /* "time-out", "suspend" or "logout" */
  };

  public scoWin:any = {};
  public API:any = {};
  public hasTerminated = false;
  public hasInitialized = false;
  public optionsOpen = true;
  public initTimeoutMax = 20000;
  public initTimeout = 0;
  public fullPath = "http://localhost:3000"
  public parentFolder = this.fullPath.substr(this.fullPath.lastIndexOf('/') + 1, this.fullPath.length);
  public timeoutErrorDisplayed = false;
  public launchWithEmbeddedParam = false;
  public launchWithCustomApiProperty = false;
  public storageObject;
  public $: any = (id) => document.getElementById(id)
  ngOnInit() {

    // JSON
    // ----------------------------------------------------------------------------
    //@ts-ignore
    Array.prototype.toJSONString = function () {
      var a = ['['],
        b, i, l = this.length,
        v;

      function p(s) {
        if (b) {
          a.push(',');
        }
        a.push(s);
        b = true;
      }

      for (i = 0; i < l; i += 1) {
        v = this[i];
        switch (typeof v) {
          case 'undefined':
          case 'function':
          //@ts-ignore
          case 'unknown':
            break;
          case 'object':
            if (v) {
              if (typeof v.toJSONString === 'function') {
                p(v.toJSONString());
              }
            } else {
              p("null");
            }
            break;
          default:
            p(v.toJSONString());
        }
      }
      a.push(']');
      return a.join('');
    };
    //@ts-ignore
    Boolean.prototype.toJSONString = function () {
      return String(this);
    };
    //@ts-ignore
    Date.prototype.toJSONString = function () {

      function f(n) {
        return n < 10 ? '0' + n : n;
      }

      return '"' + this.getFullYear() + '-' +
        f(this.getMonth() + 1) + '-' +
        f(this.getDate()) + 'T' +
        f(this.getHours()) + ':' +
        f(this.getMinutes()) + ':' +
        f(this.getSeconds()) + '"';
    };
    //@ts-ignore
    Number.prototype.toJSONString = function () {
      return isFinite(this) ? String(this) : "null";
    };
    //@ts-ignore
    Object.prototype.toJSONString = function () {
      var a = ['{'],
        b, i, v;

      function p(s) {
        if (b) {
          a.push(',');
        }
        a.push(i.toJSONString(), ':', s);
        b = true;
      }

      for (i in this) {
        if (this.hasOwnProperty(i)) {
          v = this[i];
          switch (typeof v) {
            case 'undefined':
            case 'function':
            //@ts-ignore
            case 'unknown':
              break;
            case 'object':
              if (v) {
                if (typeof v.toJSONString === 'function') {
                  p(v.toJSONString());
                }
              } else {
                p("null");
              }
              break;
            default:
              p(v.toJSONString());
          }
        }
      }
      a.push('}');
      return a.join('');
    };
    (function (s) {
      var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
      };
      //@ts-ignore
      s.parseJSON = function () {
        try {
          if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(this)) {
            return eval('(' + this + ')');
          }
        } catch (e) {}
        throw new SyntaxError("parseJSON");
      };
      //@ts-ignore
      s.toJSONString = function () {
        if (/["\\\x00-\x1f]/.test(this)) {
          return '"' + this.replace(/([\x00-\x1f\\"])/g, function (a, b) {
            var c = m[b];
            if (c) {
              return c;
            }
            c = b.charCodeAt();
            return '\\u00' +
              Math.floor(c / 16).toString(16) +
              (c % 16).toString(16);
          }) + '"';
        }
        return '"' + this + '"';
      };
    })(String.prototype);

    this.getUser().subscribe(res => {
      this.userData = res[0];
      this.initialState['cmi.core.student_id'] = `${this.userData.studentID}`;
      this.initialState['cmi.cmi.core.student_name'] = `${this.userData.firstname} ${this.userData.lastname}`
    })
    this.Utils.launchSCO();
  }

  getUser = (): Observable < any > => this.http.post < any > (URL_GET_USER, {
    action: 'username',
    payload: localStorage.getItem('gdbaseLMSToken').split("|")[0]
  });

  SimpleAPI = function (cookiename, api, initData, CC = this) {
    this.api = api;
    this.initData = initData;
    this.__data = null;
    this.cookiename = cookiename;
    this.initialized = false;
    this.terminated = false;
    this.lastError = "0";
    this.lastCmd = '';

    this.logCommand = function () {
      CC.Utils.log(this.lastCmd, 'entry');
      let lasterr = this.api.LMSGetLastError();
      if (lasterr != '0') {
        let errorstr = this.api.LMSGetErrorString(lasterr);
        let diag = this.api.LMSGetDiagnostic(lasterr);
        let msg = "Error Calling: " + this.lastCmd + "<br>";
        msg += "LMSGetLastError() = " + lasterr + "<br>";
        msg += "LMSGetErrorString('" + lasterr + "') = " + errorstr + "<br>";
        msg += "LMSGetDiagnostic('" + lasterr + "') = " + diag;
        CC.Utils.log(msg, 'error');
      }
    };

    // LMSInitialize
    this.LMSInitialize = function (arg) {
      let success = this.api.LMSInitialize(arg);
      this.lastCmd = "LMSInitialize('" + arg + "') = " + success;
      this.logCommand();
      this.initialized = (success === 'true') ? true : false;
      if (this.initialized) {
        this.terminated = false;
        CC.hasInitialized = true;
        for (let o in this.api) {
          if (typeof this.api[o] != 'function') {
            this[o] = this.api[o];
          }
        }

        this.__data = CC.Utils.getInitAPIData(this.initData);
        for (let el in this.__data) {
          CC.loadDataIntoModel(el, this.__data[el]);
        }
      }
      return success;
    };

    // LMSFinish
    this.LMSFinish = function (arg) {
      let success = this.api.LMSFinish(arg);
      this.lastCmd = "LMSFinish('" + arg + "') = " + success;
      this.logCommand();
      if (success === 'true') {
        this.initialized = false;
        this.terminated = true;
        CC.hasTerminated = true;
        if (this.__data['cmi.core.session_time'] && (this.__data['cmi.core.session_time'].length > 0)) {
          if (this.__data['cmi.core.total_time'] == null || this.__data['cmi.core.total_time'] == '') {
            this.__data['cmi.core.total_time'] = '0000:00:00.00';
          }
          let totalTime = CC.Utils.addTime(this.__data['cmi.core.total_time'], this.__data['cmi.core.session_time']);
          this.__data['cmi.core.total_time'] = totalTime;

          let cdata = this.__data.toJSONString();
          CC.storageObject.persist(this.cookiename, cdata, 365);

          CC.Utils.log('Total Time (cmi.core.total_time): ' + totalTime, 'info');
        }

        if (CC.closeOnFinish) {
          if (CC.scoWin && !CC.scoWin.closed) {
            CC.Utils.closeSCO();
          }
        }
      }
      return success;
    };

    // LMSGetValue
    this.LMSGetValue = function (name) {
      let value = unescape(this.api.LMSGetValue(name));
      this.lastCmd = "LMSGetValue('" + name + "') = " + value;
      this.logCommand();
      return value;
    };

    // LMSSetValue
    this.LMSSetValue = function (name, value) {
      let success = this.api.LMSSetValue(name, escape(value));
      this.lastCmd = "LMSSetValue('" + name + "','" + value + "') = " + success;
      this.logCommand();

      if (success === 'true') {
        this.__data[name] = value;
      }

      return success;
    };

    // LMSCommit
    this.LMSCommit = function (arg) {
      let success = this.api.LMSCommit(arg);
      this.lastCmd = "LMSCommit('" + arg + "') = " + success;
      this.logCommand();

      if (success === 'true') {
        let cdata = this.__data.toJSONString();
        CC.storageObject.persist(this.cookiename, cdata, 365);
      }

      return success;
    };

    // LMSGetErrorString
    this.LMSGetErrorString = function (arg) {
      let errorstr = this.api.LMSGetErrorString(arg);
      CC.Utils.log("LMSGetErrorString('" + arg + "') = " + errorstr, 'entry');
      return errorstr;
    };

    // LMSGetLastError
    this.LMSGetLastError = function () {
      let lasterr = this.api.LMSGetLastError();
      CC.Utils.log("LMSGetLastError() = " + lasterr, 'entry');
      return lasterr;
    };

    // LMSGetDiagnostic
    this.LMSGetDiagnostic = function (arg) {
      let diag = this.api.LMSGetDiagnostic(arg);
      CC.Utils.log("LMSGetDiagnostic('" + arg + "') = " + diag, 'entry');
      return diag;
    };
  };
  // Utilities
  // ----------------------------------------------------------------------------
  public Utils = {
    getInitAPIData: (initData) => {
      if (this.storageObject.retrieve(this.API.cookiename) !== null && this.storageObject.retrieve(this.API.cookiename) !== undefined) {
        return this.storageObject.retrieve(this.API.cookiename).parseJSON();
      } else {
        return initData;
      }
    },
    dumpAPI: () => {
      if (this.API.__data) {
        this.Utils.log('<b>Dumping API object:</b> <blockquote> ' + this.Utils.formatAPIData(this.API.__data.toJSONString()) + '</blockquote>', 'info');
      } else {
        this.Utils.log('ERROR: API object contains no data.', 'error');
      }
    },

    dumpExistingAPIData: () => {
      if (this.storageObject.retrieve(this.cookieName) !== undefined && this.storageObject.retrieve(this.cookieName) !== null) {
        let existingData = this.storageObject.retrieve(this.cookieName);
        this.Utils.log('<b>Existing API Data (from ' + this.storageObject.toString() + ' &quot;' + this.cookieName + '&quot; - To be used in API during initialization):</b> <blockquote> ' + this.Utils.formatAPIData(existingData) + '</blockquote>', 'info');
      } else {
        this.Utils.log('No Existing API data found in &quot;' + this.cookieName + '&quot;. Will use default init data.', 'info');
      }
    },

    formatAPIData: (str) => {
      let html;
      html = this.Utils.replaceAll(str, '{"', '{<br>"');
      html = this.Utils.replaceAll(html, '"}', '"<br>}');
      html = this.Utils.replaceAll(html, '","', '",<br>"');

      return html;
    },

    replaceAll: function (text, strA, strB) {
      return text.replace(new RegExp(strA, "g"), strB);
    },

    addTime: function (first, second) {
      let sFirst = first.split(":");
      let sSecond = second.split(":");
      let cFirst = sFirst[2].split(".");
      let cSecond = sSecond[2].split(".");
      let change = 0;

      let FirstCents = 0; //Cents
      if (cFirst.length > 1) {
        FirstCents = parseInt(cFirst[1], 10);
      }
      let SecondCents = 0;
      if (cSecond.length > 1) {
        SecondCents = parseInt(cSecond[1], 10);
      }
      let cents: any = FirstCents + SecondCents;
      change = Math.floor(cents / 100);
      cents = cents - (change * 100);
      if (Math.floor(cents) < 10) {
        cents = "0" + cents.toString();
      }

      let secs: any = parseInt(cFirst[0], 10) + parseInt(cSecond[0], 10) + change; //Seconds
      change = Math.floor(secs / 60);
      secs = secs - (change * 60);
      if (Math.floor(secs) < 10) {
        secs = "0" + secs.toString();
      }

      let mins: any = parseInt(sFirst[1], 10) + parseInt(sSecond[1], 10) + change; //Minutes
      change = Math.floor(mins / 60);
      mins = mins - (change * 60);
      if (mins < 10) {
        mins = "0" + mins.toString();
      }

      let hours: any = parseInt(sFirst[0], 10) + parseInt(sSecond[0], 10) + change; //Hours
      if (hours < 10) {
        hours = "0" + hours.toString();
      }

      if (cents != '0') {
        return hours + ":" + mins + ":" + secs + '.' + cents;
      } else {
        return hours + ":" + mins + ":" + secs;
      }
    },
    openWindow: (winURL, winName, winW, winH, winOpts) => {
      var winOptions: any = winOpts + ",width=" + winW + ",height=" + winH;
      var newWin: any = window.open(winURL, winName, winOptions);
      newWin.moveTo(0, 0);
      newWin.focus();
      return newWin;
    },
    log: (status, style ? ) => {
      let timeFix = function (time) {
        return (time < 10) ? '0' + time : time;
      };
      let d = new Date();
      let hrs = timeFix(d.getHours());
      let min = timeFix(d.getMinutes());
      let sec = timeFix(d.getSeconds());
      let tmp = (style) ? '<div class="' + style + '">' : '<div class="entry">';
      tmp += '&gt; ' + hrs + ':' + min + ':' + sec + ' ';
      tmp += status;
      tmp += '</div>';
      console.log(tmp);
      // this.$('debug').innerHTML += tmp;
      // this.$('debug').scrollTop = this.$('debug').scrollHeight;
    },
    clearCookieData: () => {
      let cookieNameAltVal = this.$('cookieNameAlt').value;

      if (cookieNameAltVal.length > 0) {
        if (this.storageObject.retrieve(cookieNameAltVal)) {
          this.storageObject.remove(cookieNameAltVal);
          this.Utils.log(this.storageObject.toString() + '"' + this.$('cookieNameAlt').value + '" Cleared', 'info');
        } else {
          this.Utils.log(this.storageObject.toString() + '"' + this.$('cookieNameAlt').value + '" Not Found', 'error');
        }
      } else {
        if (this.storageObject.retrieve(this.cookieName)) {
          this.storageObject.remove(this.cookieName);
          this.Utils.log(this.storageObject.toString() + '"' + this.cookieName + '" Cleared', 'info');
        } else {
          this.Utils.log(this.storageObject.toString() + '"' + this.cookieName + '" Not Found', 'error');
        }
      }
    },
    genNewSessionName: () => {
      let d = new Date();
      let hrs = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();

      if (this.useParentFolderAsCookieName) {
        var tmp = this.parentFolder + '_';
      } else {
        var tmp = 'SimpleAPI_Data_';
      }

      tmp += hrs + '.' + min + '.' + sec;

      this.$('cookieNameAlt').value = tmp;
    },
    watchWin: () => {
      if (this.scoWin && !this.scoWin.closed) {
        this.initTimeout += 1000;
        if (this.initTimeout >= this.initTimeoutMax) {
          if (!this.API.initialized && !this.timeoutErrorDisplayed) {
            this.Utils.log('ERROR: LMSInitialize not called within 20 seconds from launching.', 'error');
            this.timeoutErrorDisplayed = true;
          }
        }

        setTimeout(function () {
          this.Utils.watchWin()
        }.bind(this), 1000);
      } else {
        this.Utils.log('SCO Closed', 'info');
        if (!this.hasInitialized) {
          this.Utils.log('ERROR: LMSInitialize was never called.', 'error');
        }
        if (!this.hasTerminated) {
          this.Utils.log('ERROR: LMSFinish was never called.', 'error');
        }
      }
    },
    launchSCO: () => {
      // Reset the SimpleAPI
      let hasTerminated = false;
      let hasInitialized = false;
      this.API.terminated = false;
      this.API.initialized = false;
      this.initTimeout = 0;
      this.timeoutErrorDisplayed = false;

      let launchFileAltVal = '/courses/quiz/index_lms_html5.html';
      let cookieNameAltVal = "localhost:3000";

      if (launchFileAltVal.length > 0) {
        this.launchFile = launchFileAltVal;
        if (launchFileAltVal.indexOf(":") == 1) {
          this.launchFile = "file:///" + this.launchFile;
        }
      }

      if (cookieNameAltVal.length > 0) {
        this.API.cookiename = this.cookieName = cookieNameAltVal;
      }

      if (this.launchWithCustomApiProperty) {
        try {
          var key = this.$('customApiKey').value;
          var val = this.$('customApiValue').value;
          if (key && val) {
            this.API[key] = val;
          }
          this.Utils.log('Injected custom key/value into API object: ' + key + '=' + val, 'info');
        } catch (e) {
          console.log("Catch 1");
          this.Utils.log('ERROR: Cannot inject custom key/value into API object: ' + key + '=' + val + '(' + e + ')', 'error');
        }
      }

      try {
        let w = this.wWidth;
        let h = this.wHeight;
        let embedParam = '';
        if (this.launchWithEmbeddedParam) {
          try {
            embedParam = this.$('searchString').value;
            this.Utils.log('Appending search string to launch file: ' + this.$('searchString').value, 'info');
          } catch (e) {
            console.log("Catch 2");
            embedParam = '';
          }
        } else {
          embedParam = '';
        }

        let opts = '';
        opts += (this.wToolbar) ? 'toolbar=yes,' : '';
        opts += (this.wTitlebar) ? 'titlebar=yes,' : '';
        opts += (this.wLocation) ? 'location=yes,' : '';
        opts += (this.wStatus) ? 'status=yes,' : '';
        opts += (this.wScrollbars) ? 'scrollbars=yes,' : '';
        opts += (this.wResizable) ? 'resizable=yes,' : '';
        opts += (this.wMenubar) ? 'menubar=yes,' : '';
        opts = opts.substring(0, opts.length - 1)

        this.Utils.log("Launching SCO win with options: " + opts)
        console.log(`Opening URL: ${this.launchFile + embedParam}`);
        this.scoWin = this.Utils.openWindow(this.launchFile + embedParam, "SCOwindow", w, h, opts);
      } catch (e) {
        console.log("Catch 3", e);
        this.Utils.log('ERROR: ' + e.description, 'error');
      }

      if (this.scoWin !== null) {
        try {
          this.Utils.log('SCO Launched', 'info');
          this.scoWin.focus();
          this.Utils.watchWin();
        } catch (err) {
          console.log("Catch 4", err);
          this.Utils.log('ERROR: ' + err.description, 'error');
        }
      } else {
        this.Utils.log('ERROR: SCO windows unable to open.  Please disable any popup blockers you might have enabled and ensure the launch file path is correct.', 'error');
      }
    },
    closeSCO: function () {
      try {
        if (this.scoWin && !this.scoWin.closed) {
          this.Utils.log('Attempting to close SCO window...', 'info');
          this.scoWin.close();
        }
      } catch (e) {
        this.Utils.log('ERROR: Unable to close SCO window (' + e.description + ')', 'error');
      }
    },
    toggleDisplay: (elm) => {
      this.$(elm).style.display = (this.$(elm).style.display == 'block') ? 'none' : 'block';
    },
    toggleCloseOnFinishOption: (chkd) => {
      this.closeOnFinish = chkd;
    },
    toggleEmbeddedParam: (chkd) => {
      this.launchWithEmbeddedParam = chkd;
      this.$('searchString').disabled = !chkd;

    },
    toggleCustomKeyValueOption: (chkd) => {
      this.launchWithCustomApiProperty = chkd;
      this.$('customApiKey').disabled = !chkd;
      this.$('customApiValue').disabled = !chkd;
    },
    toggleWindowOption: (prop, el) => {
      window[prop] = el.checked;
    },
    enableAllWindowOptions: () => {
      let wToolbar = true;
      let wTitlebar = true;
      let wLocation = true;
      let wStatus = true;
      let wScrollbars = true;
      let wResizable = true;
      let wMenubar = true;
      this.$('wToolbarOption').checked = true;
      this.$('wTitlebarOption').checked = true;
      this.$('wLocationOption').checked = true;
      this.$('wStatusOption').checked = true;
      this.$('wScrollbarsOption').checked = true;
      this.$('wResizableOption').checked = true;
      this.$('wMenubarOption').checked = true;
    },
    disableAllWindowOptions: function () {
      let wToolbar = false;
      let wTitlebar = false;
      let wLocation = false;
      let wStatus = false;
      let wScrollbars = false;
      let wResizable = false;
      let wMenubar = false;
      this.$('wToolbarOption').checked = false;
      this.$('wTitlebarOption').checked = false;
      this.$('wLocationOption').checked = false;
      this.$('wStatusOption').checked = false;
      this.$('wScrollbarsOption').checked = false;
      this.$('wResizableOption').checked = false;
      this.$('wMenubarOption').checked = false;
    },
    loadManifest: () => {
      let xmlDoc = null;
      let file = this.fullPath + "/imsmanifest.xml";

      let useManifest = () => {
        try {
          let m = xmlDoc.getElementsByTagName("manifest")[0];

          let orgs = xmlDoc.getElementsByTagName("organizations")[0];
          let org = orgs.getElementsByTagName("organization")[0];
          let orgTitle = org.getElementsByTagName("title")[0].firstChild.nodeValue;

          let items = org.getElementsByTagName("item");
          let item = items[0];
          let itemTitle = item.getElementsByTagName("title")[0].firstChild.nodeValue;
          let itemMasteryScore = item.getElementsByTagName("adlcp:masteryscore")[0].firstChild.nodeValue;
          let itemIdentifier = item.getAttribute("identifier");
          let itemIdentifierRef = item.getAttribute("identifierref");

          let resources = xmlDoc.getElementsByTagName("resources")[0];
          let resource = resources.getElementsByTagName("resource");
          let itemResource = null;
          for (let i = 0; i < resource.length; i++) {
            let id = resource[i].getAttribute("identifier");
            let scormtype = resource[i].getAttribute("adlcp:scormtype");
            if (id == itemIdentifierRef && scormtype.toLowerCase() == "sco") {
              itemResource = resource[i];
            }
          }
          let itemResourceHref = itemResource.getAttribute("href");

          this.Utils.log('IMS Manifest: Organization Title = &quot;' + orgTitle + '&quot;', 'entry');
          if (items.length > 1) {
            this.Utils.log('IMS Manifest: SimpleAPI detected multiple SCO references - Only the first will be launched.', 'entry');
          }
          this.Utils.log('IMS Manifest: First SCO Item = &quot;' + itemTitle + '&quot; (Mastery Score: ' + itemMasteryScore + ' / Identifier: &quot;' + itemIdentifier + '&quot;)', 'entry');
          this.Utils.log('IMS Manifest: Resource &quot;' + itemIdentifierRef + '&quot; HREF for Item &quot;' + itemIdentifier + '&quot; = &quot;' + itemResourceHref + '&quot;');

          let obj: any = {};
          obj.id = m.getAttribute("identifier");
          obj.orgTitle = orgTitle;
          obj.itemTitle = itemTitle;
          obj.itemMasteryScore = itemMasteryScore;
          obj.itemResourceHref = itemResourceHref;

          this.$('launchFileAlt').value = itemResourceHref;

          return obj;
        } catch (e) {
          let error = e.message;
          this.Utils.log('IMS Manifest: Cannot locate or parse manifest - ' + error, 'error');
          return false;
        }
      };

      /* - For Webkit - Not now though...
      // Check for the letious File API support.
      if (window.File && window.FileReader) {
        alert('Great success! All the File APIs are supported.');
      } else {
        alert('The File APIs are not fully supported in this browser.');
      }
      */


      try //Internet Explorer
      {
        //@ts-ignore
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.onreadystatechange = function () {
          if (xmlDoc.readyState == 4) {
            useManifest();
          }
        }
        let success = xmlDoc.load(file);
      } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
          xmlDoc = document.implementation.createDocument("", "", null);
          xmlDoc.async = false;
          xmlDoc.onload = function () {
            useManifest();
          };
          let success = xmlDoc.load(file);
        } catch (e) {
          try //Google Chrome
          {
            //@ts-ignore
            let xmlhttp = new window.XMLHttpRequest();
            xmlhttp.open("GET", file, false);
            xmlhttp.send(null);
            xmlDoc = xmlhttp.responseXML.documentElement;
            //alert(success);
          } catch (e) {
            let error = e.message;
            this.Utils.log('IMS Manifest: Cannot locate or parse manifest - ' + error, 'error');

            return false;
          }
        }
      }
    }
  };

  // General/Global
  // ----------------------------------------------------------------------------
  public init = () => {
    this.scoWin = null;
    var manifestObj = null;
    // Cookie Object interface

    if (!this.skipManifestCheck) {
      manifestObj = this.Utils.loadManifest();
    }

    if (!manifestObj) {
      if (this.useParentFolderAsCookieName) {
        this.cookieName = this.parentFolder;
      }
    } else {
      if (manifestObj.id) {
        this.cookieName = manifestObj.id;
      }

      if (manifestObj.itemResourceHref) {
        this.$('launchFileAlt').value = manifestObj.itemResourceHref;
      }
    }

    var api = new GenericAPIAdaptor(this);
    this.API = new this.SimpleAPI(this.cookieName, api, this.initialState);

    // test for localStorage
    if (typeof (Storage) !== "undefined") {
      try {
        if (('localStorage' in window) && window['localStorage'] && window.localStorage !== null) {
          this.storageObject = this.localStorageObject;
        } else {
          this.storageObject = this.cookieStorageObject;
        }
      } catch (e) {
        this.storageObject = this.cookieStorageObject;
      }
    } else {
      this.storageObject = this.cookieStorageObject;
    }

    this.$('cookieNameAlt').value = this.cookieName;

    this.$('winW').value = this.wWidth;
    this.$('winH').value = this.wHeight;

    this.$('wToolbarOption').checked = this.wToolbar;
    this.$('wTitlebarOption').checked = this.wTitlebar;
    this.$('wLocationOption').checked = this.wLocation;
    this.$('wStatusOption').checked = this.wStatus;
    this.$('wScrollbarsOption').checked = this.wScrollbars;
    this.$('wResizableOption').checked = this.wResizable;
    this.$('wMenubarOption').checked = this.wMenubar;

    this.Utils.toggleDisplay('optionSet');
    this.Utils.toggleDisplay('debug');

    if (this.closeOnFinish) {
      this.$('closeOnFinishOption').checked = true;
    }

    this.launchWithEmbeddedParam = this.$('toggleEmbeddedOption').checked;
    this.launchWithCustomApiProperty = this.$('toggleCustomKeyValueOption').checked;

    this.$('searchString').disabled = !this.launchWithEmbeddedParam;
    this.$('customApiKey').disabled = !this.launchWithCustomApiProperty;
    this.$('customApiValue').disabled = !this.launchWithCustomApiProperty;


    this.$('searchString').value = this.defaultSearchString;
    this.$('customApiKey').value = this.defaultCustomApiKey;
    this.$('customApiValue').value = this.defaultCustomApiValue;

    this.Utils.log('Storage type will be: ' + this.storageObject.toString(), 'info');

    this.Utils.dumpExistingAPIData();
  };

  sendSimApi = (simAPI, title, totalToInclude, totalIncorrect, incStepNumberList) => {
    this.Utils.log('Sim API Object: ' + simAPI, 'info');
    this.Utils.log('Sim Title: ' + title, 'info');
  };

  public cookieStorageObject = {
    persist: (name, data, lifetime) => {
      this.saveCookie(name, data, lifetime)
    },
    retrieve: (name) => {
      return this.readCookie(name);
    },
    remove: (name) => {
      this.deleteCookie(name);
    },
    toString: function () {
      return "Cookie";
    }
  };

  // LocalStorage Interface
  public localStorageObject = {
    persist: function (name, data, lifetime) {
      localStorage[name] = data;
    },
    retrieve: function (name) {
      return localStorage[name];
    },
    remove: function (name) {
      delete localStorage[name];
    },
    toString: function () {
      return "LocalStorage";
    }
  };


  // Cookie Functions
  // ----------------------------------------------------------------------------

  saveCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toUTCString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  deleteCookie(name) {
    this.saveCookie(name, "", -1);
  }

  /**
   *  RELOAD TOOLS
   **/
  loadDataIntoModel(element, value) {
    if (element != "cmi.interactions._count" && element != "cmi.interactions._count") {
      if (element.indexOf("cmi.objectives") != -1) {
        this.dealWithSettingObjectives(element, value);
      } else if (element.indexOf("cmi.interactions") != -1) {
        this.dealWithSettingInteractions(element, value);
      } else {
        var result = eval("API." + element);
        if (result != null) {
          result.cmivalue = value;
        }
      }
    }
  }

  /*
   * ---------------------------------------------------------------------------------------------
   *	API Javascript Functions
   * ---------------------------------------------------------------------------------------------
   */

  /*
   * LMSInitialize. Initialize this sco (if it is one)
   */
  LMSInitializeMethod = function (parameter) {
    // check that this has been called with an empty string...
    if (parameter != "") {
      this.ServerSco.lastError = "201"
      return "false";
    }
    // check that we are not already initialized...
    if (this.ServerSco.isInitialized == "false") {
      this.ServerSco.isInitialized = "true";
      this.ServerSco.lastError = "0"
      return "true";
    } else {
      this.ServerSco.lastError = "101"
      return "false";
    }
  }

  /*
   * LMSFinish. Finish this sco session.
   */
  LMSFinishMethod = function (parameter) {
    // check that this has been called with an empty string...
    if (parameter != "") {
      this.ServerSco.lastError = "201";
      return "false";
    }
    // make sure that the server is initialized...
    if (this.ServerSco.isInitialized == "true") {
      this.ServerSco.isInitialized = "false";
      this.ServerSco.lastError = "0";
      return "true";
    } else {
      // not initialized
      this.ServerSco.lastError = "301";
      return "false";
    }
  }



  /*
   * LMSCommit.  Method to update/persist any changed items in the CMI datamodel
   */
  LMSCommitMethod = function (parameter) {
    // check that this has been called with an empty string...
    if (parameter != "") {
      this.ServerSco.lastError = "201"
      return "false";
    }
    if (this.ServerSco.isInitialized == "true") {
      this.ServerSco.lastError = "0";
      return "true";
    } else {
      // not initialized
      this.ServerSco.lastError = "301";
      return "false";
    }
  }

  dealWithGettingObjectives(element) {
    // RETURN _CHILDREN
    if (element == "cmi.objectives._children") {
      this.API.ServerSco.lastError = "0";
      return this.API.cmi.objectives._children.cmivalue;
    }

    // RETURN _COUNT
    if (element == "cmi.objectives._count") {
      this.API.ServerSco.lastError = "0";
      return this.API.cmi.objectives._count.cmivalue;
    }

    // ELSE CHECK THAT THE ELEMENT IS VALID AND HAS AT LEAST 3 PARAMS
    var cmiArray = element.split(".");
    if (cmiArray.length < 3) {
      this.API.ServerSco.lastError = "201";
      return "";
    }

    var theCount = this.API.cmi.objectives._count.cmivalue;

    // IF 3RD ARG IS NOT A NUMBER THEN THROW ERROR
    // need to check cmiArray[2] to see if its a number
    if (isNaN(cmiArray[2])) {
      this.API.ServerSco.lastError = "401";
      return "";
    }

    // IF ITS A NUMBER MAKE SURE ITS IN THE ARRAY BOUNDS
    if (cmiArray[2] >= theCount) {
      // call to array is out of bounds
      this.API.ServerSco.lastError = "201";
      return "";
    } else { // WEVE GOT TO THE POINT OF VALIDATING cmi.objective.n
      // does this element exist in the objectives array? - sanity check...
      var mystr = "API." + cmiArray[0] + "." + cmiArray[1] + ".objArray(" + cmiArray[2] + ");",
        ans = eval(mystr);
      //if it doesn't exist
      if (ans == null) {
        this.API.ServerSco.lastError = "201";
        return "";
      } else {
        // we need to see if the call is asking for a valid element under cmi.objectives.n
        // we can trust the element parameter now to call the following...
        var subelementstr = "ans";
        for (var i = 3; i < cmiArray.length; i++) {
          subelementstr = subelementstr + "." + cmiArray[i];
        }

        var objTest = eval(subelementstr);
        if (objTest == null) {
          this.API.ServerSco.lastError = "201";
          return "false";
        }

        subelementstr = subelementstr + ".cmivalue;";
        var res = eval(subelementstr);
        if (res == null) {
          this.API.ServerSco.lastError = "201";
          return "";
        } else {
          this.API.ServerSco.lastError = "0";
          return res;
        }
      }
    }
  }

  dealWithGettingInteractions(element) {
    // RETURN _CHILDREN
    if (element == "cmi.interactions._children") {
      this.API.ServerSco.lastError = "0";
      return this.API.cmi.interactions._children.cmivalue;
    }

    // RETURN _COUNT
    if (element == "cmi.interactions._count") {
      this.API.ServerSco.lastError = "0";
      return this.API.cmi.interactions._count.cmivalue;
    }

    // ELSE CHECK THAT THE ELEMENT IS VALID AND HAS AT LEAST 3 PARAMS, DOESNT HAVE
    // MORE THAN 6 PARAMS  - IF SO, ITS ILLEGAL
    var cmiArray = element.split(".");
    if (cmiArray.length < 3 || cmiArray.length > 6) {
      this.API.ServerSco.lastError = "201";
      return "";
    }

    var theCount = this.API.cmi.interactions._count.cmivalue;

    // IF 3RD ARG IS NOT A NUMBER THEN THROW ERROR
    // need to check cmiArray[2] to see if its a number
    if (isNaN(cmiArray[2])) {
      this.API.ServerSco.lastError = "401";
      return "";
    }

    // IF ITS A NUMBER MAKE SURE ITS IN THE ARRAY BOUNDS
    if (cmiArray[2] >= theCount) {
      // call to array is out of bounds
      this.API.ServerSco.lastError = "201";
      return "";
    } else { // WEVE GOT TO THE POINT OF VALIDATING cmi.interactions.n
      // does this element exist in the interactions array? - sanity check...
      //
      // We are checking that 'cmi.interactions.n' exists
      var mystr = "API." + cmiArray[0] + "." + cmiArray[1] + ".intArray(" + cmiArray[2] + ")",
        ans = eval(mystr);
      //if it doesn't exist
      if (ans == null) {
        this.API.ServerSco.lastError = "201";
        return "";
      } else {
        // if theres 4 bits to the element path then try to see if object exists
        if (cmiArray.length == 4) {
          var strleaf = "ans." + cmiArray[3] + ";";
          var doesLeafExist = eval(strleaf);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "";
          } else {
            // NEXT CHECK THAT THIS ELEMENT IS NOT WRITEONLY
            var strleafstatus = mystr + "." + cmiArray[3] + ".cmireadStatus;";
            var leafstatus = eval(strleafstatus);
            if (leafstatus == "writeonly") {
              this.API.ServerSco.lastError = "404";
              return "";
            }

            // WE CAN NOW TRY TO GET THE FULL OBJECT REFERENCE
            var strleafval = mystr + "." + cmiArray[3] + ".cmivalue;";
            var leafVal = eval(strleafval);
            if (leafVal == null) {
              // IT FAILED AT THE FINAL HURDLE...
              this.API.ServerSco.lastError = "201";
              return "";
            } else {
              this.API.ServerSco.lastError = "0";
              return leafVal;
            }

          }
        }
        // if theres 5 bits to the element path then try to see if object exists
        if (cmiArray.length == 5) {
          // check object exists
          var strbranch = "ans." + cmiArray[3] + ";";
          var doesLeafExist = eval(strbranch);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "";
          }

          // check final object exists in the array list...
          var nextstrbranch = "ans." + cmiArray[3] + "." + cmiArray[4] + ";";
          var doesLeafExist = eval(nextstrbranch);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "";
          }

          // check for write only
          var strread = "ans." + cmiArray[3] + "." + cmiArray[4] + ".cmireadStatus;";
          var isWriteOnly = eval(strread);
          if (isWriteOnly == "writeonly") {
            this.API.ServerSco.lastError = "404";
            return "";
          }

          // see if value exists
          var strleaf = "ans." + cmiArray[3] + "." + cmiArray[4] + ".cmivalue;";
          var doesLeafExist = eval(strleaf);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "";
          } else {
            this.API.ServerSco.lastError = "0";
            return doesLeafExist;
          }

        }
        // if theres 6 bits to the element path then try to see if object exists
        if (cmiArray.length == 6) {
          // check object exists
          strbranch = "ans." + cmiArray[3];
          var doesBranchExist = eval(strbranch);
          if (doesBranchExist == null) {
            this.API.ServerSco.lastError = "201";
            return "";
          }
          // The fifth argument should be an array reference, so do some checking...

          // IF 5TH ARG IS NOT A NUMBER THEN THROW ERROR
          // need to check cmiArray[4] to see if its a number
          if (isNaN(cmiArray[4])) {
            this.API.ServerSco.lastError = "401";
            return "";
          }

          // check to see if this element has a _count
          // If it hasn't we'll have to throw an error here
          // because we need the correct array index for array #2...
          theCount = "ans." + cmiArray[3] + "._count.cmivalue;";
          var hasCount = eval(theCount);
          // CANT FIND _COUNT FOR THIS ELEMENT, SO THROW AN ERROR...
          if (hasCount == null) {
            this.API.ServerSco.lastError = "201";
            return "";
          }
          // next need to check to see if array ref is in array bounds
          if (cmiArray[4] >= hasCount || cmiArray[4] < 0) {
            // call to array is out of bounds
            this.API.ServerSco.lastError = "201";
            return "";
          }
          // make sure that array index 4 is either 'objectives' or 'correct_responses'
          if (cmiArray[3] == "objectives") {
            // next check that there is an object here at this array index...
            var arrayIndex2Check = eval("ans." + cmiArray[3] + ".objectivesInteractionArray(" + cmiArray[4] + ")");
            // check for null
            if (arrayIndex2Check == null) {
              this.API.ServerSco.lastError = "201";
              return "";
            } else {
              // next check that the last element is valid...
              var finalObjectCheck = eval("arrayIndex2Check." + cmiArray[5]);
              if (finalObjectCheck == null) {
                this.API.ServerSco.lastError = "201";
                return "";
              } else {
                // call must be to a valid element in the model so...
                // check it for writeonly...
                var isWriteonly = eval("finalObjectCheck.cmireadStatus");
                if (isWriteonly == "writeonly") {
                  this.API.ServerSco.lastError = "404";
                  return "";
                } else {
                  this.API.ServerSco.lastError = "0";
                  return eval("finalObjectCheck.cmivalue");
                }
              }
            }
          } else if (cmiArray[3] == "correct_responses") {
            // next check that there is an object here at this array index...
            var arrayIndex2Check = eval("ans." + cmiArray[3] + ".correctResponsesInteractionArray(" + cmiArray[4] + ")");
            // check for null
            if (arrayIndex2Check == null) {
              this.API.ServerSco.lastError = "201";
              return "";
            } else {
              // next check that the last element is valid...
              finalObjectCheck = eval("arrayIndex2Check." + cmiArray[5]);
              if (finalObjectCheck == null) {
                this.API.ServerSco.lastError = "201";
                return "";
              } else {
                // call must be to a valid element in the model so...
                // check it for writeonly...
                isWriteonly = eval("finalObjectCheck.cmireadStatus");
                if (isWriteonly == "writeonly") {
                  this.API.ServerSco.lastError = "404";
                  return "";
                } else {
                  this.API.ServerSco.lastError = "0";
                  return eval("finalObjectCheck.cmivalue");
                }
              }
            }
          } else {
            // throw an error becuase 4th arg was not either
            // objectives or correct_responses
            this.API.ServerSco.lastError = "201";
            return "";
          }
        }
      }
    }
  }

  dealWithSettingObjectives(element, value) {
    //  _CHILDREN ARE READONLY
    if (element == "cmi.objectives._children") {
      this.API.ServerSco.lastError = "402";
      return "false";
    }

    //  _COUNT IS READ ONLY
    if (element == "cmi.objectives._count") {
      this.API.ServerSco.lastError = "402";
      return "false";
    }

    // ELSE CHECK THAT THE ELEMENT IS VALID AND HAS AT LEAST 3 PARAMS
    var cmiArray = element.split(".");
    if (cmiArray.length < 3) {
      this.API.ServerSco.lastError = "201";
      return "false";
    }

    // IF 3RD ARG IS NOT A NUMBER THEN THROW ERROR
    // need to check cmiArray[2] to see if its a number
    if (isNaN(cmiArray[2])) {
      this.API.ServerSco.lastError = "401";
      return "false";
    }


    var theCount = this.API.cmi.objectives._count.cmivalue;

    // IF ITS A NUMBER MAKE SURE ITS IN THE ARRAY BOUNDS
    if (cmiArray[2] > theCount || cmiArray[2] < 0) {
      // call to array is out of bounds
      this.API.ServerSco.lastError = "201";
      return "false";
    } else if (cmiArray[2] == theCount || cmiArray[2] < theCount) {

      //create a new one
      var existingObjectiveHandle = this.API.cmi.objectives.objArray(cmiArray[2]);
      if (existingObjectiveHandle == null) {
        this.API.ServerSco.lastError = "101";
        return "false";
      } else {
        // we need to see if the call is asking for a valid element under cmi.objectives.n
        // we can trust the element parameter now to call the following...
        var subelementstr = "existingObjectiveHandle";
        for (var i = 3; i < cmiArray.length; i++) {
          subelementstr = subelementstr + "." + cmiArray[i];
        }

        var objTest = eval(subelementstr);
        if (objTest == null) {
          this.API.ServerSco.lastError = "201";
          return "false";

        }

        var subelementstrWithoutLeaf = subelementstr;
        var subelementstr = subelementstr + ".cmireadStatus;";
        var res = eval(subelementstr);
        if (res == null) {
          this.API.ServerSco.lastError = "101";
          return "false";
        } else {
          if (res == "readonly") {
            this.API.ServerSco.lastError = "403";
            return "false";
          } else {

            // check the datatype and vocabulary...
            var datatype = objTest.cmidatatype;
            res = this.API.ServerSco.checkDataTypeAndVocab(element, value, datatype);

            if (res == "true") {
              // correct datatype...
              // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
              var strleafval = "objTest.cmivalue =\"" + value + "\";";
              var leafVal = eval(strleafval);
              if (leafVal == null) {
                // IT FAILED AT THE FINAL HURDLE...
                this.API.ServerSco.lastError = "201";
                return "false";
              } else {
                this.API.ServerSco.lastError = "0";
                return "true";
              }
            } else {
              // incorrect data type...
              this.API.ServerSco.lastError = "405";
              return "false";
            }

          }
        }
      }
    }
  }

  dealWithSettingInteractions(element, value) {
    //  _CHILDREN ARE READONLY
    if (element == "cmi.interactions._children") {
      this.API.ServerSco.lastError = "402";
      return "false";
    }

    //  _COUNT IS READ ONLY
        if (element == "cmi.interactions._count") {
      this.API.ServerSco.lastError = "402";
      return "false";
    }

    // ELSE CHECK THAT THE ELEMENT IS VALID AND HAS AT LEAST 3 PARAMS, DOESNT HAVE
    // MORE THAN 6 PARAMS  - ALL ILLEGAL
    var cmiArray = element.split(".");
    if (cmiArray.length < 3 || cmiArray.length > 6) {
      this.API.ServerSco.lastError = "201";
      return "false";
    }

    var theCount = this.API.cmi.interactions._count.cmivalue;

    // IF 3RD ARG IS NOT A NUMBER THEN THROW ERROR
    // need to check cmiArray[2] to see if its a number
    if (isNaN(cmiArray[2])) {
      this.API.ServerSco.lastError = "401";
      return "false";
    }

    var theCount = this.API.cmi.interactions._count.cmivalue;

    // IF ITS A NUMBER MAKE SURE ITS IN THE ARRAY BOUNDS
    if (cmiArray[2] > theCount || cmiArray[2] < 0) {
      // call to array is out of bounds
      this.API.ServerSco.lastError = "201";
      return "false";
    } else if (cmiArray[2] <= theCount) {

      //create a new one or get existing object
      var existingObjectiveHandle = this.API.cmi.interactions.intArray(cmiArray[2]);
      if (existingObjectiveHandle == null) {
        this.API.ServerSco.lastError = "101";
        return "false";
      } else {
        // we now have a reference to cmi.interactions.n
        // if theres 4 bits to the element path then try to see if object exists

        if (cmiArray.length == 4) {
          var strleaf = "existingObjectiveHandle." + cmiArray[3];
          var doesLeafExist = eval(strleaf);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "false";
          } else {

            // NEXT CHECK THAT THIS ELEMENT IS NOT READONLY
            var strleafstatus = "doesLeafExist.cmireadStatus";
            var leafstatus = eval(strleafstatus);
            if (leafstatus == "readonly") {
              this.API.ServerSco.lastError = "403";
              return "false";
            }

            // check the datatype and vocabulary...
            var datatype = doesLeafExist.cmidatatype;
            var res = this.API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
            if (res == "true") {
              // correct datatype...
              // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
              var strleafval = "doesLeafExist.cmivalue =\"" + value + "\";";
              var leafVal = eval(strleafval);
              if (leafVal == null) {
                // IT FAILED AT THE FINAL HURDLE...
                this.API.ServerSco.lastError = "201";
                return "false";
              } else {
                this.API.ServerSco.lastError = "0";
                return "true";
              }
            } else {
              // incorrect data type...
              this.API.ServerSco.lastError = "405";
              return "false";
            }
          }
        }
        if (cmiArray.length == 5) {
          // check object exists
          var strbranch = "existingObjectiveHandle." + cmiArray[3] + ";";
          var doesLeafExist = eval(strbranch);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "false";
          }

          // check final object exists in the array list...
          var nextstrbranch = "existingObjectiveHandle." + cmiArray[3] + "." + cmiArray[4] + ";";
          var doesLeafExist = eval(nextstrbranch);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "false";
          }

          // check for write only
          var strread = "existingObjectiveHandle." + cmiArray[3] + "." + cmiArray[4] + ".cmireadStatus;";
          var isWriteOnly = eval(strread);
          if (isWriteOnly == "readonly") {
            this.API.ServerSco.lastError = "403";
            return "false";
          }

          // see if value exists
          strleaf = "existingObjectiveHandle." + cmiArray[3] + "." + cmiArray[4] + ".cmivalue;";
          var doesLeafExist = eval(strleaf);
          if (doesLeafExist == null) {
            this.API.ServerSco.lastError = "201";
            return "false";
          } else {
            // check the datatype and vocabulary...
            var datatype = doesLeafExist.cmidatatype;
            res = this.API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
            if (res == "true") {
              // correct datatype...
              // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
              var strleafval = "doesLeafExist.cmivalue =\"" + value + "\";";
              var leafVal = eval(strleafval);
              if (leafVal == null) {
                // IT FAILED AT THE FINAL HURDLE...
                this.API.ServerSco.lastError = "201";
                return "false";
              } else {
                this.API.ServerSco.lastError = "0";
                return "true";
              }
            } else {
              // incorrect data type...
              this.API.ServerSco.lastError = "405";
              return "false";
            }
          }
        }
        if (cmiArray.length == 6) {
          // check object exists
          strbranch = "existingObjectiveHandle." + cmiArray[3];
          var doesBranchExist = eval(strbranch);
          if (doesBranchExist == null) {
            this.API.ServerSco.lastError = "201";
            return "false";
          }
          // The fifth argument should be an array reference, so do some checking...

          // IF 5TH ARG IS NOT A NUMBER THEN THROW ERROR
          // need to check cmiArray[4] to see if its a number
          if (isNaN(cmiArray[4])) {
            this.API.ServerSco.lastError = "401";
            return "false";
          }

          // check to see if this element has a _count
          // If it hasn't we'll have to throw an error here
          // because we need the correct array index for array #2...
          var theCount: any = "existingObjectiveHandle." + cmiArray[3] + "._count.cmivalue;";
          var hasCount = eval(theCount);
          // CANT FIND _COUNT FOR THIS ELEMENT, SO THROW AN ERROR...
          if (hasCount == null) {
            this.API.ServerSco.lastError = "201";
            return "false";
          }
          // next need to check to see if array ref is in array bounds
          if (cmiArray[4] > hasCount || cmiArray[4] < 0) {
            // call to array is out of bounds
            this.API.ServerSco.lastError = "201";
            return "false";
          }

          // make sure that array index 4 is either 'objectives' or 'correct_responses'
          if (cmiArray[3] == "objectives") {
            // next check that there is an object here at this array index...
            var arrayIndex2Check = eval("existingObjectiveHandle." + cmiArray[3] + ".objectivesInteractionArray(" + cmiArray[4] + ")");
            // check for null
            if (arrayIndex2Check == null) {
              this.API.ServerSco.lastError = "201";
              return "false";
            } else {
              // next check that the last element is valid...
              var finalObjectCheck = eval("arrayIndex2Check." + cmiArray[5]);
              if (finalObjectCheck == null) {
                this.API.ServerSco.lastError = "201";
                return "false";
              } else {
                // call must be to a valid element in the model so...
                // check it for readonly...
                var isWriteonly = eval("finalObjectCheck.cmireadStatus");
                if (isWriteonly == "readonly") {
                  this.API.ServerSco.lastError = "403";
                  return "false";
                } else {

                  // check the datatype and vocabulary...
                  var datatype = finalObjectCheck.cmidatatype;
                  res = this.API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
                  if (res == "true") {
                    // correct datatype...
                    // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
                    var strleafval = "finalObjectCheck.cmivalue =\"" + value + "\";";
                    var leafVal = eval(strleafval);
                    if (leafVal == null) {
                      // IT FAILED AT THE FINAL HURDLE...
                      this.API.ServerSco.lastError = "201";
                      return "false";
                    } else {
                      this.API.ServerSco.lastError = "0";
                      return "true";
                    }
                  } else {
                    // incorrect data type...
                    this.API.ServerSco.lastError = "405";
                    return "false";
                  }
                }
              }
            }
          } else if (cmiArray[3] == "correct_responses") {
            // next check that there is an object here at this array index...
            var arrayIndex2Check = eval("existingObjectiveHandle." + cmiArray[3] + ".correctResponsesInteractionArray(" + cmiArray[4] + ")");
            // check for null
            if (arrayIndex2Check == null) {
              this.API.ServerSco.lastError = "201";
              return "false";
            } else {
              // next check that the last element is valid...
              finalObjectCheck = eval("arrayIndex2Check." + cmiArray[5]);
              if (finalObjectCheck == null) {
                this.API.ServerSco.lastError = "201";
                return "false";
              } else {
                // call must be to a valid element in the model so...
                // check it for readonly...
                isWriteonly = eval("finalObjectCheck.cmireadStatus");
                if (isWriteonly == "readonly") {
                  this.API.ServerSco.lastError = "403";
                  return "false";
                } else {
                  // check the datatype and vocabulary...
                  var datatype = finalObjectCheck.cmidatatype;
                  res = this.API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
                  if (res == "true") {
                    // correct datatype...
                    // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
                    var strleafval = "finalObjectCheck.cmivalue =\"" + value + "\";";
                    var leafVal = eval(strleafval);
                    if (leafVal == null) {
                      // IT FAILED AT THE FINAL HURDLE...
                      this.API.ServerSco.lastError = "201";
                      return "false";
                    } else {
                      this.API.ServerSco.lastError = "0";
                      return "true";
                    }
                  } else {
                    // incorrect data type...
                    this.API.ServerSco.lastError = "405";
                    return "false";
                  }

                }
              }
            }
          } else {
            // throw an error because 4th arg was not either
            // objectives or correct_responses
            this.API.ServerSco.lastError = "201";
            return "false";
          }

        }

      }
    }

  }

  /*
   * LMSGetValue.  Method to allow sco to read/access CMI datamodel elements
   */
  LMSGetValueMethod(element) {
    var ServerSco: any = {};
    if (ServerSco.isInitialized == "true") {
      var invalid = "false";
      var cannotHaveChildren = "false";
      var isNotAnArray = "false";

      // this checks to make sure there is at least one dot in the value
      if (element.indexOf(".") == -1) {
        invalid = "true";
      }

      // dont bother doing this if we have already found an error...
      if (invalid != "true") {
        // we then loop around the children, making sure they exist one, by one...
        var cmiArray = element.split(".");
        var teststring = "this";
        for (var i = 0; i < cmiArray.length; i++) {
          var doesExist = eval(teststring + "." + cmiArray[i] + ";");
          if (doesExist == null) {
            invalid = "true";
            // check for invalid _children call
            if (cmiArray[i] == "_children") {
              cannotHaveChildren = "true";
            }
            // check for invalid _count call
            if (cmiArray[i] == "_count") {
              isNotAnArray = "true";
            }
            break;
          } else {
            teststring = teststring + "." + cmiArray[i];
            // WE NEED TO TRAP THE OBJECTIVES...
            if (teststring == "this.cmi.objectives") {
              return this.dealWithGettingObjectives(element);
            }
            // WE NEED TO TRAP THE INTERACTIONS...
            if (teststring == "this.cmi.interactions") {
              return this.dealWithGettingInteractions(element);
            }
          }
        }
      }

      // user tried to call _count on a non-array value
      if (isNotAnArray == "true") {
        ServerSco.lastError = "203";
        return "";
      }

      // user tried to call _children on an element that didnt support it
      if (cannotHaveChildren == "true") {
        ServerSco.lastError = "202";
        return "";
      }

      // if there was some kind of error found above, then...
      if (invalid == "true") {
        ServerSco.lastError = "401";
        return "";
      } else {
        // otherwise its a valid model reference...
        var elementObj = eval("this." + element);
      }

      // next we will check to make sure this element is not writeonly..
      if (elementObj.cmireadStatus == "writeonly") {
        ServerSco.lastError = "404";
        return "";
      } else {
        // its okay and user can read it...
        ServerSco.lastError = "0";
        return elementObj.cmivalue;
      }
    } else {
      // not initialized...
      ServerSco.lastError = "301";
      return "";
    }
  }



  /*
   * LMSSetValue.  Method to allow sco to write data to CMI datamodel
   */
  LMSSetValueMethod(element, value) {
    value = unescape(value);
    var ServerSco: any = {};
    if (ServerSco.isInitialized == "true") {
      var invalid = "false";
      var cannotHaveChildren = "false";
      var isNotAnArray = "false";

      // check for sco trying to set _children & _count
      //element is a keyword, cannot set...
      if (element.indexOf("._children") != -1 || element.indexOf("._count") != -1) {
        ServerSco.lastError = "402";
        return "false";
      }

      // this checks to make sure there is at least one dot in the value
      // if it doesnt, then it cant be a valid CMI model reference
      if (element.indexOf(".") == -1) {
        invalid = "true";
      }

      // dont bother doing this if we have already found an error...
      if (invalid != "true") {
        // we then loop around the children, making sure they exist one, by one...
        var cmiArray = element.split(".");
        var teststring = "this";
        for (var i = 0; i < cmiArray.length; i++) {
          var doesExist = eval(teststring + "." + cmiArray[i] + ";");
          if (doesExist == null) {
            invalid = "true";
            // check for invalid _children call
            if (cmiArray[i] == "_children") {
              cannotHaveChildren = "true";
            }
            // check for invalid _count call
            if (cmiArray[i] == "_count") {
              isNotAnArray = "true";
            }
            break;
          } else {
            teststring = teststring + "." + cmiArray[i];
            // WE NEED TO TRAP THE OBJECTIVES...
            if (teststring == "this.cmi.objectives") {
              return this.dealWithSettingObjectives(element, value);
            }
            // WE NEED TO TRAP THE INTERACTIONS...
            if (teststring == "this.cmi.interactions") {
              return this.dealWithSettingInteractions(element, value);
            }
          }
        }
      }

      // user tried to call _count on a non-array value
      if (isNotAnArray == "true") {
        ServerSco.lastError = "203";
        return "false";
      }

      // user tried to call _children on an element that didnt support it
      if (cannotHaveChildren == "true") {
        ServerSco.lastError = "202";
        return "false";
      }

      // if there was some kind of error found above, then...
      if (invalid == "true") {
        ServerSco.lastError = "401";
        return "false";
      } else {
        // otherwise its a valid model reference...
        var elementObj = eval("this." + element);
      }

      // check that its writeable...
      if (elementObj.cmireadStatus == "readonly") {
        ServerSco.lastError = "403";
        return "false";
      } else {
        // check the datatype and vocabulary...
        var datatype = elementObj.cmidatatype;
        var res = ServerSco.checkDataTypeAndVocab(element, value, datatype);
        if (res == "true") {
          // correct datatype...
          // cmi.comments need to be appended...
          if (element == "cmi.comments") {
            var pre = this.LMSGetValueMethod("cmi.comments");
            var setString = "this." + element + ".cmivalue =\"" + pre + value + "\";";
          } else {
            setString = "this." + element + ".cmivalue =\"" + value + "\";";
          }
          var result = eval(setString);
          ServerSco.lastError = "0";
          return "true";
        } else {
          // incorrect data type...
          ServerSco.lastError = "405";
          return "false";
        }
      }
    } else {
      // not initialized...
      ServerSco.lastError = "301";
      return "false";
    }
  }

  LMSGetErrorStringMethod(errorCode) {
    switch (errorCode) {
      case "0":
        {
          return "No error";
        }
      case "101":
        {
          return "General exception";
        }
      case "201":
        {
          return "Invalid argument error";
        }
      case "202":
        {
          return "Element cannot have children";
        }
      case "203":
        {
          return "Element not an array - Cannot have count";
        }
      case "301":
        {
          return "Not initialized";
        }
      case "401":
        {
          return "Not implemented error";
        }
      case "402":
        {
          return "Invalid set value, element is a keyword";
        }
      case "403":
        {
          return "Element is read only";
        }
      case "404":
        {
          return "Element is write only";
        }
      case "405":
        {
          return "Incorrect Data Type";
        }
      default:
        {
          return "";
        }
    }
  }

  LMSGetLastErrorMethod() {
    var ServerSco: any = {};
    return ServerSco.lastError;
  }

  LMSGetDiagnosticMethod(errorCode) {
    var ServerSco: any = {};
    if (errorCode == "") {
      errorCode = ServerSco.lastError;
    }
    switch (errorCode) {
      case "0":
        {
          return "No error. No errors were encountered. Successful API call.";
          }
      case "101":
        {
          return "General exception. An unexpected error was encountered.";
          }
      case "201":
        {
          return "Invalid argument error. A call was made to a DataModel element that does not exist.";
          }
      case "202":
        {
          return "Element cannot have children. A call was made to an Element that does not support _children";
          }
      case "203":
        {
          return "Element is not an array.  Cannot have count. A call was made to an Element that does not support _count.";
          }
      case "301":
        {
          return "Not initialized. The SCO has not yet been initialized.  It needs to call LMSInitialize() first.";
          }
      case "401":
        {
          return "Not implemented error.  A call was made to a DataModel element that is not supported.";
          }
      case "402":
        {
          return "Invalid set value, element is a keyword.  Keyword values cannot be changed";
          }
      case "403":
        {
          return "Element is read only.  A call was made to set the value of a read-only element.";
          }
      case "404":
        {
          return "Element is write only.  A call was made to get the value of a write-only element.";
          }
      case "405":
        {
          return "Incorrect Data Type.  The syntax of a call to change an element was incorrect.";
          }
      default:
        {
          return "";
          }
    }
  }

  /*
   * --------------------------------------------------------------------------------------------------
   *	Datatype and vocabulary checking
   * --------------------------------------------------------------------------------------------------
   */

  checkCMIDecimalOrCMIBlank(value) {

    var isBlank = this.checkCMIBlank(value);
    var isCMIDecimal = this.checkCMIDecimal(value);
    if (isBlank == "true" || isCMIDecimal == "true") {
      if (value > 100 || value < 0) {
        return "false";
      } else {
        return "true";
      }
    } else {
      return "false";
    }
  }

  checkCMIVocabularyResult(value) {
    var ans = this.checkCMIDecimal(value);
    if (ans == "true") {
      return "true";
    }
    if (value == "correct" || value == "wrong" ||
      value == "unanticipated" || value == "neutral") {
      return "true";
    } else {
      return "false";
    }
  }


  checkCMIVocabularyInteraction(value) {
    if (value == "true-false" || value == "choice" ||
      value == "fill-in" || value == "matching" ||
      value == "performance" || value == "likert" ||
      value == "sequencing" || value == "numeric") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIVocabularyTimeLimitAction(value) {
    if (value == "exit,message" || value == "exit,no message" ||
      value == "continue,message" || value == "continue,no message") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIVocabularyExit(value) {
    if (value == "time-out" || value == "suspend" ||
      value == "logout" || value == "") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIVocabularyMode(value) {
    if (value == "normal" || value == "review" || value == "browse") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIVocabularyEntry(value) {
    if (value == "ab-initio" || value == "resume" || value == "") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIVocabularyStatus(element, value) {
    // sco cannot set lesson_status to not attempted
    if (element == "cmi.core.lesson_status" && value == "not attempted") {
      return false;
    }
    if (value == "passed" || value == "completed" ||
      value == "failed" || value == "incomplete" ||
      value == "browsed" || value == "not attempted") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIVocabularyCredit(value) {
    if (value == "credit" || value == "no-credit") {
      return "true";
    } else {
      return "false";
    }
  }


  checkCMITimespan(value) {
    // must have some colons...
    if (value.indexOf(":") == -1) {
      return "false";
    }
    // must contain at least 2 colons, giving 3 array elements...
    var cmiArray = value.split(":");
    if (cmiArray.length < 3) {
      return "false";
    }
    // hours must be 4,3 or 2 digits...
    if (cmiArray[0].length < 2 || cmiArray[0].length > 4) {
      return "false";
    }
    // minutes must be 2 digits...
    if (cmiArray[1].length != 2) {
      return "false";
    }
    // must be numbers...
    if (isNaN(cmiArray[0]) || isNaN(cmiArray[1]) || isNaN(cmiArray[2])) {
      return "false";
    }
    // 24hr clock for hours...
    if (parseInt(cmiArray[0]) < 0) {
      return "false";
    }
    // parse minutes
    // NOTE: Seems illegal to have 99 minutes, but ADL 1.2
    // SCORM Conformance Test Suite does this? I'll do the same...
    // if (parseInt(cmiArray[1]) < 0 || parseInt(cmiArray[1]) > 59){
    if (parseInt(cmiArray[1]) < 0) {
      return "false";
    }
    // check for decimal place...
    if (cmiArray[2].indexOf(".") != -1) {
      var cmiDecArray = cmiArray[2].split(".");
      // can only be 2 values here...
      if (cmiDecArray.length != 2) {
        return "false";
      }
      // again they must be numbers...
      if (isNaN(cmiDecArray[0]) || isNaN(cmiDecArray[1])) {
        return "false";
      }
      // only two digits allowed for seconds...
      if (cmiDecArray[0].length != 2) {
        return "false";
      }
      // make sure there is less than 60 seconds here...
      if (parseInt(cmiDecArray[0]) > 59) {
        return "false";
      }
      // only one or two digits allowed for milliseconds...
      if (cmiDecArray[1].length > 2) {
        return "false";
      }
    } else {
      // no dots, so must be no milliseconds...
      // make sure length is 2
      if (cmiArray[2].length != 2) {
        return "false";
      }
      // make sure there is less than 60 seconds here...
      if (parseInt(cmiArray[2]) > 59) {
        return "false";
      }
    }
    // got up to here, then value okay...
    return "true";
  }

  checkCMITime(value) {

    // must have some colons...
    if (value.indexOf(":") == -1) {
      return "false";
    }
    // must contain at least 2 colons, giving 3 array elements...
    var cmiArray = value.split(":");
    if (cmiArray.length < 3) {
      return "false";
    }
    // hours & minutes must be 2 digits...
    if (cmiArray[0].length != 2 || cmiArray[1].length != 2) {
      return "false";
    }
    // must be numbers...
    if (isNaN(cmiArray[0]) || isNaN(cmiArray[1]) || isNaN(cmiArray[2])) {
      return "false";
    }
    // 24hr clock for hours...
    if (parseInt(cmiArray[0]) < 0 || parseInt(cmiArray[0]) > 23) {
      return "false";
    }
    // parse minutes
    if (parseInt(cmiArray[1]) < 0 || parseInt(cmiArray[1]) > 59) {
      return "false";
    }
    // check for decimal place...
    if (cmiArray[2].indexOf(".") != -1) {
      var cmiDecArray = cmiArray[2].split(".");
      // can only be 2 values here...
      if (cmiDecArray.length != 2) {
        return "false";
      }
      // again they must be numbers...
      if (isNaN(cmiDecArray[0]) || isNaN(cmiDecArray[1])) {
        return "false";
      }
      // only two digits allowed for seconds...
      if (cmiDecArray[0].length != 2) {
        return "false";
      }
      // make sure there is less than 60 seconds here...
      if (parseInt(cmiDecArray[0]) > 59) {
        return "false";
      }
      // only one or two digits allowed for milliseconds...
      if (cmiDecArray[1].length > 2) {
        return "false";
      }
    } else {
      // no dots, so must be no milliseconds...
      // make sure length is 2
      if (cmiArray[2].length != 2) {
        return "false";
      }
      // make sure there is less than 60 seconds here...
      if (parseInt(cmiArray[2]) > 59) {
        return "false";
      }
    }
    // got up to here, then value okay...
    return "true";
  }


  checkCMIString4096(value) {
    if (value.length <= 4096) {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIString255(value) {
    if (value.length <= 255) {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMISInteger(element, value) {
    if (isNaN(value)) {
      return "false";
    } else {
      var num = parseInt(value);
      if (num >= -32768 && num <= 32768) {
        if (element == "cmi.student_preference.audio") {
          if (num < -1 || num > 100) {
            return "false";
          } else {
            return "true";
          }
        } else if (element == "cmi.student_preference.speed") {
          if (num < -100 || num > 100) {
            return "false";
          } else {
            return "true";
          }
        } else if (element == "cmi.student_preference.text") {
          if (num < -1 || num > 1) {
            return "false";
          } else {
            return "true";
          }
        } else {
          return "true";
        }
      } else {
        return "false";
      }
    }
  }

  checkCMIInteger(value) {
    if (isNaN(value)) {
      return "false";
    } else {
      var num = parseInt(value);
      if (num >= 0 && num <= 65536) {
        return "true";
      } else {
        return "false";
      }
    }
  }

  checkCMIIdentifier(value) {
    var SPACE = ' ';
    var TAB = '\t';
    var CRETURN = '\r';
    var LINEFEED = '\n';
    if (value.indexOf(SPACE) == -1 && value.indexOf(TAB) == -1 &&
      value.indexOf(CRETURN) == -1 && value.indexOf(LINEFEED) == -1) {
      if (value.length > 0 && value.length < 256) {
        return "true";
      } else {
        return "false";
      }
    } else {
      return "false";
    }
  }



  checkCMIFeedback(element, value) {
    var looseChecking;
    // allow user to edit var at top of page to disable this checking...
    if (looseChecking == "false") {
      // need to find the type (if its set)
      var cmiArray = element.split(".");
      // need to check cmiArray[2] to see if its a number
      if (isNaN(cmiArray[2])) {
        // this should be a number. However, Err on the side of caution...
        return "false";
      }
      // make sure that this interaction already exists...
      var res = this.API.LMSGetValue("cmi.interactions._count");
      if (parseInt(cmiArray[2]) >= parseInt(res)) {
        // then this interaction does not exist.. However, Err on the side of caution...
        return "false";
      }
      // Up to here? - then get the type
      var theType = "cmi.interactions.intArray(" + cmiArray[2] + ").type";
      var elementObj = eval("API." + theType + ";");
      if (elementObj == null) {
        return "false";
      }
      var datatype = elementObj.cmivalue;

      if (datatype == null) {
        return "false";
      }
      // its not null, so it equals something, so...
      switch (datatype) {
        case "true-false":
          {
            return this.checkTrueFalse(value);
              }
        case "choice":
          {
            return this.checkChoice(value);
              }
        case "fill-in":
          {
            return this.checkFillIn(value);
              }
        case "numeric":
          {
            return this.checkCMIDecimal(value);
              }
        case "likert":
          {
            return this.checkLikert(value);
              }
        case "matching":
          {
            return this.checkMatching(value);
              }
        case "performance":
          {
            return this.checkCMIString255(value);
              }
        case "sequencing":
          {
            return this.checkSequencing(value);
              }
          // if its not been set then we should return false.  That would mean
          // that a cmi.interaction.n.type MUST have a value and cannot be empty
        default:
          {
            return "false";
              }
      }
    } else {
      return "true";
    }

  }

  checkMatching(value) {
    // check for n.n
    var TEST_VAL = /^[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1}$/;
    // check for n.n,n.n,n.n etc
    var TEST_VAL2 = /^[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1},{1})*[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1}$/;
    // check for {n.n,n.n,n.n etc }
    // Bugfix Mozilla firebird didnt like this line below
    // var TEST_VAL3 = /^{[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1},{1})*[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1}}$/;
    var TEST_VAL3 = /^[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1},{1})*[a-z,A-Z,0-9]{1}.{1}[a-z,A-Z,0-9]{1}$/;
    if (TEST_VAL.test(value)) {
      return "true";
    } else if (TEST_VAL2.test(value)) {
      return "true";
    } else if (TEST_VAL3.test(value)) {
      return "true";
    } else {
      return "false";
    }
  }


  checkSequencing(value) {

    // test for single a-z 0-9
    var TEST_VAL = /^[a-z,A-Z,0-9]{1}$/;

    // test for format 1,2,3,a,b,c
    var TEST_VAL2 = /^[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9],)*[a-z,A-Z,0-9]{1}$/;

    if (TEST_VAL.test(value)) {
      return "true";
    } else if (TEST_VAL2.test(value)) {
      return "true";
    } else {
      return "false";
    }
  }

  checkChoice(value) {
    // test for single a-z 0-9
    var TEST_VAL = /^[a-z,A-Z,0-9]{1}$/;

    // test for format 1,2,3,a,b,c
    var TEST_VAL2 = /^[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9],)*[a-z,A-Z,0-9]{1}$/;

    // test for format {1,2,3,a,b,c}
    // Bugfix Mozilla firebird didnt like this line below
    //var TEST_VAL3 = /^{[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9],)*[a-z,A-Z,0-9]{1}}$/;
    var TEST_VAL3 = /^[a-z,A-Z,0-9]{1},{1}([a-z,A-Z,0-9],)*[a-z,A-Z,0-9]{1}$/;

    if (TEST_VAL.test(value)) {
      return "true";
    } else if (TEST_VAL2.test(value)) {
      return "true";
    } else if (TEST_VAL3.test(value)) {
      return "true";
    } else {
      return "false";
    }
  }


  checkFillIn(value) {
    return this.checkCMIString255(value);
  }


  checkTrueFalse(value) {
    if (value == "0" || value == "1" || value == "t" || value == "f" || value == "T" || value == "F") {
      return "true";
    } else {
      return "false";
    }
  }


  checkLikert(value) {
    if (value.length == 0) {
      return "true";
    }
    if (value.length > 1) {
      return "false";
    }
    var TEST_VAL = /^[a-z,A-Z,0-9]{1}$/;
    if (TEST_VAL.test(value)) {
      return "true";
    } else {
      return "false";
    }
  }


  checkCMIDecimal(value) {
    if (isNaN(value)) {
      return "false";
    } else {
      return "true";
    }
  }

  checkCMIBoolean(value) {
    if (value == "true" || value == "false") {
      return "true";
    } else {
      return "false";
    }
  }

  checkCMIBlank(value) {
    if (value != "") {
      return "false";
    } else {
      return "true";
    }
  }
  InteractionsArrayModel = function (index, cc = this) {
    if (index > this._count.cmivalue - 1) {
      if (index == this._count.cmivalue) {
        // then create new one...
        this.intArr[index] = new cc.singleInteractionModel();
        this._count.cmivalue = this._count.cmivalue + 1;
        return this.intArr[index];
      } else {
        return "false";
      }
    } else {
      // we must be talking about this one so return object..
      return this.intArr[index];
    }
  }

  SingleObjectivesInteractionModel = function(index, cc=this) {
    if (index > this._count.cmivalue - 1) {
      if (index == this._count.cmivalue) {
        // then create new one...
        this.objectivesInteractionArr[index] = new cc.SingleItemObjectivesInteractionModel();
        this._count.cmivalue = this._count.cmivalue + 1;
        return this.objectivesInteractionArr[index];
      } else {
        return "false";
      }
    } else {
      // we must be talking about this one so return object..
      return this.objectivesInteractionArr[index];
    }
  }
  
  
  SingleItemObjectivesInteractionModel = function() {
    this.id = new CMIComponent("id", "", "writeonly", "CMIIdentifier");
  }
  
  
  
  CorrectResponsesInteractionModel =  function(cc = this) {
    this._count = new CMIComponent("_count", 0, "readonly", "CMIInteger");
    this.correctResponsesInteractionArray = cc.SingleCorrectResponsesInteractionModel;
    this.correctResponsesInteractionArr = new Array();
  }
  
  
  SingleCorrectResponsesInteractionModel = function(index, cc = this) {
    if (index > this._count.cmivalue - 1) {
      if (index == this._count.cmivalue) {
        // then create new one...
        this.correctResponsesInteractionArr[index] = new cc.SingleItemCorrectResponsesInteractionModel();
        this._count.cmivalue = this._count.cmivalue + 1;
        return this.correctResponsesInteractionArr[index];
      } else {
        return "false";
      }
    } else {
      // we must be talking about this one so return object..
      return this.correctResponsesInteractionArr[index];
    }
  }
  
  
  SingleItemCorrectResponsesInteractionModel = function() {
    this.pattern = new CMIComponent("pattern", "", "writeonly", "CMIFeedback");
  }

  showCurrentModelState(infoOrForm) {

    var divider = "";
    var titles = "";
    var equals = "";
    if (infoOrForm == "info") {
      divider = "\n";
      equals = "=";
      titles = "Current client CMI Datamodel\n\n";
    } else {
      equals = "~r@l@ad~";
      divider = "^r@l@ad^";
      titles = "";
    }

    var a = "cmi.core.student_id" + equals + this.API.cmi.core.student_id.cmivalue + divider;
    var b = "cmi.core.student_name" + equals + this.API.cmi.core.student_name.cmivalue + divider;
    var c = "cmi.core.lesson_location" + equals + this.API.cmi.core.lesson_location.cmivalue + divider;
    var d = "cmi.core.credit" + equals + this.API.cmi.core.credit.cmivalue + divider;
    var e = "cmi.core.lesson_status" + equals + this.API.cmi.core.lesson_status.cmivalue + divider;
    var f = "cmi.core.entry" + equals + this.API.cmi.core.entry.cmivalue + divider;
    var g = "cmi.core.score.raw" + equals + this.API.cmi.core.score.raw.cmivalue + divider;
    var h = "cmi.core.score.max" + equals + this.API.cmi.core.score.max.cmivalue + divider;
    var i = "cmi.core.score.min" + equals + this.API.cmi.core.score.min.cmivalue + divider;
    var j = "cmi.core.total_time" + equals + this.API.cmi.core.total_time.cmivalue + divider;
    var k = "cmi.core.lesson_mode" + equals + this.API.cmi.core.lesson_mode.cmivalue + divider;
    var l = "cmi.core.exit" + equals + this.API.cmi.core.exit.cmivalue + divider;
    var m = "cmi.core.session_time" + equals + this.API.cmi.core.session_time.cmivalue + divider;
    var n = "cmi.suspend_data" + equals + this.API.cmi.suspend_data.cmivalue + divider;
    var o = "cmi.launch_data" + equals + this.API.cmi.launch_data.cmivalue + divider;
    var p = "cmi.comments" + equals + this.API.cmi.comments.cmivalue + divider;
    var q = "cmi.comments_from_lms" + equals + this.API.cmi.comments_from_lms.cmivalue + divider;
    var r = "cmi.objectives._count" + equals + this.API.cmi.objectives._count.cmivalue + divider;

    var s = "";
    var objectivesCount = this.API.cmi.objectives._count.cmivalue;
    for (var count = 0; count < objectivesCount; count++) {
      var objHandle = this.API.cmi.objectives.objArray(count);
      var idval = objHandle.id.cmivalue;
      var scoreRaw = objHandle.score.raw.cmivalue;
      var scoreMax = objHandle.score.max.cmivalue;
      var scoreMin = objHandle.score.min.cmivalue;
      var statval = objHandle.status.cmivalue;
      s = s + "cmi.objectives." + count + ".id" + equals + idval + divider;
      s = s + "cmi.objectives." + count + ".score.raw" + equals + scoreRaw + divider;
      s = s + "cmi.objectives." + count + ".score.max" + equals + scoreMax + divider;
      s = s + "cmi.objectives." + count + ".score.min" + equals + scoreMin + divider;
      s = s + "cmi.objectives." + count + ".status" + equals + statval + divider;
    }


    var v = "cmi.student_data.mastery_score" + equals + this.API.cmi.student_data.mastery_score.cmivalue + divider;
    var w = "cmi.student_data.max_time_allowed" + equals + this.API.cmi.student_data.max_time_allowed.cmivalue + divider;
    var x = "cmi.student_data.time_limit_action" + equals + this.API.cmi.student_data.time_limit_action.cmivalue + divider;

    var y = "cmi.student_preference.audio" + equals + this.API.cmi.student_preference.audio.cmivalue + divider;
    var z = "cmi.student_preference.language" + equals + this.API.cmi.student_preference.language.cmivalue + divider;
    var zz = "cmi.student_preference.speed" + equals + this.API.cmi.student_preference.speed.cmivalue + divider;
    var zzz = "cmi.student_preference.text" + equals + this.API.cmi.student_preference.text.cmivalue + divider;

    var t = "cmi.interactions._count" + equals + this.API.cmi.interactions._count.cmivalue + divider;

    var u = "";
    var interactionsCount = this.API.cmi.interactions._count.cmivalue
    for (var intcount = 0; intcount < interactionsCount; intcount++) {
      var intHandle = this.API.cmi.interactions.intArray(intcount);

      idval = intHandle.id.cmivalue;
      u = u + "cmi.interactions." + intcount + ".id" + equals + idval + divider;

      var interObjCount = intHandle.objectives._count.cmivalue;
      u = u + "cmi.interactions." + intcount + ".objectives._count" + equals + interObjCount + divider;

      for (var objcount = 0; objcount < interObjCount; objcount++) {
        var interactionObjectiveHandle = intHandle.objectives.objectivesInteractionArray(objcount);
        var objid = interactionObjectiveHandle.id.cmivalue;
        u = u + "cmi.interactions." + intcount + ".objectives." + objcount + ".id" + equals + objid + divider;
      }

      var srCount = intHandle.correct_responses._count.cmivalue;
      u = u + "cmi.interactions." + intcount + ".correct_responses._count" + equals + srCount + divider;

      for (var objcount = 0; objcount < srCount; objcount++) {
        var interactionSRHandle = intHandle.correct_responses.correctResponsesInteractionArray(objcount);
        var patternid = interactionSRHandle.pattern.cmivalue;
        u = u + "cmi.interactions." + intcount + ".correct_responses." + objcount + ".pattern" + equals + patternid + divider;
      }


      var timeval = intHandle.time.cmivalue;
      u = u + "cmi.interactions." + intcount + ".time" + equals + timeval + divider;

      var typeval = intHandle.type.cmivalue;
      u = u + "cmi.interactions." + intcount + ".type" + equals + typeval + divider;

      var weightingval = intHandle.weighting.cmivalue;
      u = u + "cmi.interactions." + intcount + ".weighting" + equals + weightingval + divider;

      var student_responseval = intHandle.student_response.cmivalue;
      u = u + "cmi.interactions." + intcount + ".student_response" + equals + student_responseval + divider;

      var resultval = intHandle.result.cmivalue;
      u = u + "cmi.interactions." + intcount + ".result" + equals + resultval + divider;

      var latencyval = intHandle.latency.cmivalue;
      u = u + "cmi.interactions." + intcount + ".latency" + equals + latencyval + divider;
    }

    var alertString = titles + a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + v + w + x + y + z + zz + zzz + t + u;
    return alertString;

  }

  /*
   * a function used in debug mode to see the current cmi model
   */
  viewModel() {
    return this.showCurrentModelState("info");
  }
}

/*
 * Top level object to hold complete CMI data model and API methods
 */
class GenericAPIAdaptor {
  public cmi;
  public LMSInitialize;
  public LMSGetValue;
  public LMSSetValue;
  public LMSCommit;
  public LMSFinish;
  public LMSGetLastError;
  public LMSGetErrorString;
  public LMSGetDiagnostic;
  public ServerSco;
  constructor(private player: ScormPlayerComponent) {
    this.cmi = new CMIModel(this.player);
    this.LMSInitialize = this.player.LMSInitializeMethod;
    this.LMSGetValue = this.player.LMSGetValueMethod;
    this.LMSSetValue = this.player.LMSSetValueMethod;
    this.LMSCommit = this.player.LMSCommitMethod;
    this.LMSFinish = this.player.LMSFinishMethod;
    this.LMSGetLastError = this.player.LMSGetLastErrorMethod;
    this.LMSGetErrorString = this.player.LMSGetErrorStringMethod;
    this.LMSGetDiagnostic = this.player.LMSGetDiagnosticMethod;
    this.ServerSco = new ServerScoSettings(this.player);
  }
}

/*
 * A CMIComponent holds properties for each CMI element in the model.
 * Here we keep the element name, it current value, its read/write status
 * and finally it CMI datatype
 */
class CMIComponent {
  public cminame;
  public cmivalue;
  public cmireadStatus;
  public cmidatatype;
  constructor(thename, thevalue, readstatus, datatype) {
    this.cminame = thename;
    this.cmivalue = thevalue;
    this.cmireadStatus = readstatus;
    this.cmidatatype = datatype;
  }
}

/*
 *  Object ServerScoSettings()
 *  Used to store server specific settings and error codes etc..
 *  Is accessed as an object inside this implementation of the API object.
 */
class ServerScoSettings {
  public isInitialized;
  public lastError;
  public checkDataTypeAndVocab;
  constructor(
    private player: ScormPlayerComponent
  ) {
    this.isInitialized = "false";
    this.lastError = "0";
    this.checkDataTypeAndVocab = this.scoCheckDataTypeAndVocab;
  }

  /*
   * Method to check the datatype and vocabulary of an element
   * returns true or false...
   */
  scoCheckDataTypeAndVocab(element, value, datatype) {
    switch (datatype) {
      case "CMIBlank":
        {
          return this.player.checkCMIBlank(value);
          }
      case "CMIBoolean":
        {
          return this.player.checkCMIBoolean(value);
          }
      case "CMIDecimal":
        {
          return this.player.checkCMIDecimal(value);
          }
      case "CMIFeedback":
        {
          return this.player.checkCMIFeedback(element, value);
          }
      case "CMIIdentifier":
        {
          return this.player.checkCMIIdentifier(value);
          }
      case "CMIInteger":
        {
          return this.player.checkCMIInteger(value);
          }
      case "CMISInteger":
        {
          return this.player.checkCMISInteger(element, value);
          }
      case "CMIString255":
        {
          return this.player.checkCMIString255(value);
          }
      case "CMIString4096":
        {
          return this.player.checkCMIString4096(value);
          }
      case "CMITime":
        {
          return this.player.checkCMITime(value);
          }
      case "CMITimespan":
        {
          return this.player.checkCMITimespan(value);
          }
      case "CMIVocabularyCredit":
        {
          return this.player.checkCMIVocabularyCredit(value);
          }
      case "CMIVocabularyStatus":
        {
          return this.player.checkCMIVocabularyStatus(element, value);
          }
      case "CMIVocabularyEntry":
        {
          return this.player.checkCMIVocabularyEntry(value);
          }
      case "CMIVocabularyMode":
        {
          return this.player.checkCMIVocabularyMode(value);
          }
      case "CMIVocabularyExit":
        {
          return this.player.checkCMIVocabularyExit(value);
          }
      case "CMIVocabularyTimeLimitAction":
        {
          return this.player.checkCMIVocabularyTimeLimitAction(value);
          }
      case "CMIVocabularyInteraction":
        {
          return this.player.checkCMIVocabularyInteraction(value);
          }
      case "CMIVocabularyResult":
        {
          return this.player.checkCMIVocabularyResult(value);
          }
      case "CMIDecimalOrCMIBlank":
        {
          return this.player.checkCMIDecimalOrCMIBlank(value);
          }
      default:
        {
          return "true";
          }
    }
  }
}

/*
 * ----------------------------------------------------------------------------------------------------
 *
 *	The CMI Client side data models
 *
 * ----------------------------------------------------------------------------------------------------
 */



class CMIModel {
  public _version;
  public core;
  public suspend_data;
  public launch_data;
  public comments;
  public comments_from_lms;
  public objectives;
  public student_data;
  public student_preference;
  public interactions;
  constructor(private player: ScormPlayerComponent) {
    this._version = new CMIComponent("_version", "3.4", "readonly", "");
    this.core = new CMICoreModel;
    this.suspend_data = new CMIComponent("suspend_data", "", "both", "CMIString4096");
    this.launch_data = new CMIComponent("launch_data", "", "readonly", "CMIString4096");
    this.comments = new CMIComponent("comments", "", "both", "CMIString4096");
    this.comments_from_lms = new CMIComponent("comments_from_lms", "", "readonly", "CMIString4096");
    this.objectives = new ObjectivesModel;
    this.student_data = new StudentDataModel;
    this.student_preference = new StudentPreferenceModel;
    this.interactions = new InteractionsModel(this.player);
  }
}


class CMICoreModel {
  public _children;
  public student_id;
  public student_name;
  public lesson_location;
  public credit;
  public lesson_status;
  public entry;
  public score;
  public total_time;
  public lesson_mode;
  public exit;
  public session_time;
  constructor() {
    this._children = new CMIComponent("_children", "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time", "readonly", "CMIString255");
    this.student_id = new CMIComponent("student_id", "", "readonly", "CMIIdentifier");
    this.student_name = new CMIComponent("student_name", "", "readonly", "CMIString255");
    this.lesson_location = new CMIComponent("lesson_location", "", "both", "CMIString255");
    this.credit = new CMIComponent("credit", "", "readonly", "CMIVocabularyCredit");
    this.lesson_status = new CMIComponent("lesson_status", "", "both", "CMIVocabularyStatus");
    this.entry = new CMIComponent("entry", "", "readonly", "CMIVocabularyEntry");
    this.score = new CMIScore;
    this.total_time = new CMIComponent("total_time", "", "readonly", "CMITimespan");
    this.lesson_mode = new CMIComponent("lesson_mode", "", "readonly", "CMIVocabularyMode");
    this.exit = new CMIComponent("exit", "", "writeonly", "CMIVocabularyExit");
    this.session_time = new CMIComponent("session_time", "", "writeonly", "CMITimespan");
  }
}


class CMIScore {
  public _children
  public raw
  public max
  public min
  constructor() {
    this._children = new CMIComponent("_children", "raw,min,max", "readonly", "CMIString255");
    this.raw = new CMIComponent("raw", "", "both", "CMIDecimalOrCMIBlank");
    this.max = new CMIComponent("max", "", "both", "CMIDecimalOrCMIBlank");
    this.min = new CMIComponent("min", "", "both", "CMIDecimalOrCMIBlank");
  }
}


class StudentPreferenceModel {
  public _children
  public audio
  public language
  public speed
  public text
  constructor() {
    this._children = new CMIComponent("_children", "audio,language,speed,text", "readonly", "CMIString255");
    this.audio = new CMIComponent("audio", "0", "both", "CMISInteger");
    this.language = new CMIComponent("language", "", "both", "CMIString255");
    this.speed = new CMIComponent("speed", "0", "both", "CMISInteger");
    this.text = new CMIComponent("text", "0", "both", "CMISInteger");
  }
}


class StudentDataModel {
  public _children
  public mastery_score
  public max_time_allowed
  public time_limit_action
  constructor() {
    this._children = new CMIComponent("_count", "mastery_score,max_time_allowed,time_limit_action", "readonly", "CMIString255");
    this.mastery_score = new CMIComponent("mastery_score", "", "readonly", "CMIDecimal");
    this.max_time_allowed = new CMIComponent("max_time_allowed", "", "readonly", "CMITimespan");
    this.time_limit_action = new CMIComponent("time_limit_action", "", "readonly", "CMIVocabularyTimeLimitAction");
  }
}



/*
 *  The CMI objectives model
 */

function ObjectivesModel() {
  this._children = new CMIComponent("_children", "id,score,status", "readonly", "CMIString255");
  this._count = new CMIComponent("_count", 0, "readonly", "CMIInteger");
  this.objArray = ObjectiveArrayModel;
  this.objArr = new Array();
}

function ObjectiveArrayModel(index) {
  if (index > this._count.cmivalue - 1) {
    if (index == this._count.cmivalue) {
      // then create new one...
      this.objArr[index] = new singleObjectiveModel();
      this._count.cmivalue = this._count.cmivalue + 1;
      return this.objArr[index];
    } else {
      return "false";
    }
  } else {
    // we must be talking about this one so return object..
    return this.objArr[index];
  }
}


class singleObjectiveModel {
  public id;
  public score;
  public status;
  constructor() {
    this.id = new CMIComponent("id", "", "both", "CMIIdentifier");
    this.score = new objectiveScoreModel;
    this.status = new CMIComponent("status", "", "both", "CMIVocabularyStatus");
  }
}

class objectiveScoreModel {
  public _children
  public raw
  public min
  public max
  constructor() {
    this._children = new CMIComponent("_children", "raw,min,max", "readonly", "CMIString255");
    this.raw = new CMIComponent("raw", "", "both", "CMIDecimalOrCMIBlank");
    this.min = new CMIComponent("min", "", "both", "CMIDecimalOrCMIBlank");
    this.max = new CMIComponent("max", "", "both", "CMIDecimalOrCMIBlank");
  }
}



/*
 *  The CMI interactions model
 */

class InteractionsModel {
  public _children
  public _count
  public intArray
  public intArr
  constructor(private player: ScormPlayerComponent) {
    this._children = new CMIComponent("_children", "id,objectives,time,type,correct_responses,weighting,student_response,result,latency", "readonly", "CMIString255");
    this._count = new CMIComponent("_count", 0, "readonly", "CMIInteger");
    this.intArray = this.player.InteractionsArrayModel;
    this.intArr = new Array();
  }
}


class singleInteractionModel {
  public id;
  public objectives;
  public time;
  public type;
  public correct_responses;
  public weighting;
  public student_response;
  public result;
  public latency;
  constructor(private player:ScormPlayerComponent) {
    this.id = new CMIComponent("id", "", "writeonly", "CMIIdentifier");
    this.objectives = new ObjectivesInteractionModel(this.player);
    this.time = new CMIComponent("time", "", "writeonly", "CMITime");
    this.type = new CMIComponent("type", "", "writeonly", "CMIVocabularyInteraction");
    this.correct_responses = new this.player.CorrectResponsesInteractionModel;
    this.weighting = new CMIComponent("weighting", "", "writeonly", "CMIDecimal");
    this.student_response = new CMIComponent("student_response", "", "writeonly", "CMIFeedback");
    this.result = new CMIComponent("result", "", "writeonly", "CMIVocabularyResult");
    this.latency = new CMIComponent("latency", "", "writeonly", "CMITimespan");
  }
}


class ObjectivesInteractionModel{
   public _count;
   public objectivesInteractionArray;
   public objectivesInteractionArr;
  constructor(private player:ScormPlayerComponent){
  this._count = new CMIComponent("_count", 0, "readonly", "CMIInteger");
  this.objectivesInteractionArray = this.player.SingleObjectivesInteractionModel;
  this.objectivesInteractionArr = new Array();
  }
}
