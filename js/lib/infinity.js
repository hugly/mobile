/**
 * Created by hulgy on 16/7/10.
 */
//     (c) 2012 Airbnb, Inc.
//
//     infinity.js may be freely distributed under the terms of the BSD
//     license. For all licensing information, details, and documention:
//     http://airbnb.github.com/infinity
!function(e,t,n){"use strict";function l(e,t){t=t||{},this.$el=k(),this.$shadow=k(),e.append(this.$el),this.lazy=!!t.lazy,this.lazyFn=t.lazy||null,c(this),this.top=this.$el.offset().top,this.width=0,this.height=0,this.pages=[],this.startIndex=0,E.attach(this)}function c(e){e._$buffer=k().prependTo(e.$el)}function h(e){var t,n=e.pages,r=e._$buffer;n.length>0?(t=n[e.startIndex],r.height(t.top)):r.height(0)}function p(e,t){t.$el.remove(),e.$el.append(t.$el),C(t,e.height),t.$el.remove()}function d(e){var n,r,i,s=e.pages,o=!1,u=!0;n=e.startIndex,r=t.min(n+f,s.length);for(n;n<r;n++)i=s[n],e.lazy&&i.lazyload(e.lazyFn),o&&i.onscreen&&(u=!1),u?i.onscreen||(o=!0,i.appendTo(e.$el)):(i.stash(e.$shadow),i.appendTo(e.$el))}function v(e){var n,i,s,o,u,a=e.startIndex,l=r.scrollTop()-e.top,c=r.height(),p=l+c,v=b(e,l,p);if(v<0||v===a)return a;s=e.pages,a=e.startIndex,o=t.min(a+f,s.length),u=t.min(v+f,s.length);for(n=a,i=o;n<i;n++)(n<v||n>=u)&&s[n].stash(e.$shadow);return e.startIndex=v,d(e),h(e),v}function m(e,t){var r;return t instanceof N?t:(typeof t=="string"&&(t=n(t)),r=new N(t),p(e,r),r)}function g(e,t){y(e)}function y(e){var t,n,r,i,s,o,u,a,f,l=e.pages,c=[];n=new S(e),c.push(n);for(r=0,i=l.length;r<i;r++){t=l[r],u=t.items;for(s=0,o=u.length;s<o;s++)a=u[s],f=a.clone(),n.hasVacancy()?n.append(f):(n=new S(e),c.push(n),n.append(f));t.remove()}e.pages=c,d(e)}function b(e,n,r){var i=w(e,n,r);return i=t.max(i-a,0),i=t.min(i,e.pages.length),i}function w(e,n,r){var i,s,o,u,f,l,c,h=e.pages,p=n+(r-n)/2;u=t.min(e.startIndex+a,h.length-1);if(h.length<=0)return-1;o=h[u],f=o.top+o.height/2,c=p-f;if(c<0){for(i=u-1;i>=0;i--){o=h[i],f=o.top+o.height/2,l=p-f;if(l>0)return l<-c?i:i+1;c=l}return 0}if(c>0){for(i=u+1,s=h.length;i<s;i++){o=h[i],f=o.top+o.height/2,l=p-f;if(l<0)return-l<c?i:i-1;c=l}return h.length-1}return u}function S(e){this.parent=e,this.items=[],this.$el=k(),this.id=x.generatePageId(this),this.$el.attr(u,this.id),this.top=0,this.bottom=0,this.width=0,this.height=0,this.lazyloaded=!1,this.onscreen=!1}function T(e,t){var n,r,i,s=t.items;for(n=0,r=s.length;n<r;n++)if(s[n]===e){i=n;break}return i==null?!1:(s.splice(i,1),t.bottom-=e.height,t.height=t.bottom-t.top,t.hasVacancy()&&g(t.parent,t),!0)}function N(e){this.$el=e,this.parent=null,this.top=0,this.bottom=0,this.width=0,this.height=0}function C(e,t){var n=e.$el;e.top=t,e.height=n.outerHeight(!0),e.bottom=e.top+e.height,e.width=n.width()}function k(){return n("<div>").css({margin:0,padding:0,border:"none"})}function L(e){var t;e?(t=e.ListView,n.fn.listView=function(e){return new t(this,e)}):delete n.fn.listView}var r=n(e),i=e.infinity,s=e.infinity={},o=s.config={},u="data-infinity-pageid",a=1,f=a*2+1;o.PAGE_TO_SCREEN_RATIO=3,o.SCROLL_THROTTLE=350,l.prototype.append=function(e){if(!e||!e.length)return null;var t,n=m(this,e),r=this.pages;this.height+=n.height,this.$el.height(this.height),t=r[r.length-1];if(!t||!t.hasVacancy())t=new S(this),r.push(t);return t.append(n),d(this),n},l.prototype.remove=function(){this.$el.remove(),this.cleanup()},l.prototype.find=function(e){var t,r,i;return typeof e=="string"?(r=this.$el.find(e),i=this.$shadow.find(e),this.find(r).concat(this.find(i))):e instanceof N?[e]:(t=[],e.each(function(){var e,r,i,s,o,a,f=n(this).parentsUntil("["+u+"]").andSelf().first(),l=f.parent();e=l.attr(u),r=x.lookup(e);if(r){i=r.items;for(s=0,o=i.length;s<o;s++){a=i[s];if(a.$el.is(f)){t.push(a);break}}}}),t)},l.prototype.cleanup=function(){var e=this.pages,t;E.detach(this);while(t=e.pop())t.cleanup()};var E=function(){function s(){t||(setTimeout(u,o.SCROLL_THROTTLE),t=!0)}function u(){var e,n;for(e=0,n=i.length;e<n;e++)v(i[e]);t=!1}function a(){n&&clearTimeout(n),n=setTimeout(f,200)}function f(){var e,t;for(e=0;t=i[e];e++)y(t)}var e=!1,t=!1,n=null,i=[];return{attach:function(t){e||(r.on("scroll",s),r.on("resize",a),e=!0),i.push(t)},detach:function(t){var n,o;for(n=0,o=i.length;n<o;n++)if(i[n]===t)return i.splice(n,1),i.length===0&&(r.off("scroll",s),r.off("resize",a),e=!1),!0;return!1}}}();S.prototype.append=function(e){var t=this.items;t.length===0&&(this.top=e.top),this.bottom=e.bottom,this.width=this.width>e.width?this.width:e.width,this.height=this.bottom-this.top,t.push(e),e.parent=this,this.$el.append(e.$el),this.lazyloaded=!1},S.prototype.prepend=function(e){var t=this.items;this.bottom+=e.height,this.width=this.width>e.width?this.width:e.width,this.height=this.bottom-this.top,t.push(e),e.parent=this,this.$el.prepend(e.$el),this.lazyloaded=!1},S.prototype.hasVacancy=function(){return this.height<r.height()*o.PAGE_TO_SCREEN_RATIO},S.prototype.appendTo=function(e){this.onscreen||(this.$el.appendTo(e),this.onscreen=!0)},S.prototype.prependTo=function(e){this.onscreen||(this.$el.prependTo(e),this.onscreen=!0)},S.prototype.stash=function(e){this.onscreen&&(this.$el.appendTo(e),this.onscreen=!1)},S.prototype.remove=function(){this.onscreen&&(this.$el.remove(),this.onscreen=!1),this.cleanup()},S.prototype.cleanup=function(){var e=this.items,t;this.parent=null,x.remove(this);while(t=e.pop())t.cleanup()},S.prototype.lazyload=function(e){var t=this.$el,n,r;if(!this.lazyloaded){for(n=0,r=t.length;n<r;n++)e.call(t[n],t[n]);this.lazyloaded=!0}};var x=function(){var e=[];return{generatePageId:function(t){return e.push(t)-1},lookup:function(t){return e[t]||null},remove:function(t){var n=t.id;return e[n]?(e[n]=null,!0):!1}}}();N.prototype.clone=function(){var e=new N(this.$el);return e.top=this.top,e.bottom=this.bottom,e.width=this.width,e.height=this.height,e},N.prototype.remove=function(){this.$el.remove(),T(this,this.parent),this.cleanup()},N.prototype.cleanup=function(){this.parent=null},s.ListView=l,s.Page=S,s.ListItem=N,L(s),s.noConflict=function(){return e.infinity=i,L(i),s}}(window,Math,jQuery);