(function () {
    var a = false,
        b = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;
    this.Class = function () {};
    Class.extend = function (g) {
        var f = this.prototype;
        a = true;
        var e = new this();
        a = false;
        for (var d in g) {
            e[d] = typeof g[d] == "function" && typeof f[d] == "function" && b.test(g[d]) ? (function (h, i) {
                return function () {
                    var k = this._super;
                    this._super = f[h];
                    var j = i.apply(this, arguments);
                    this._super = k;
                    return j;
                };
            })(d, g[d]) : g[d];
        }
        function c() {
            if (!a && this.init) {
                this.init.apply(this, arguments);
            }
        }
        c.prototype = e;
        c.constructor = c;
        c.extend = arguments.callee;
        return c;
    };
})();
if (typeof (console) === "undefined") {
    var console = {
        log: function () {},
        dir: function () {}
    };
}
if (typeof (MMM) === "undefined") {
    var MMM = {};
}(function (a) {
    a.fn.socialize = function (c) {
        var b = {
            refreshTime: 15,
            feeds: {}
        };
        if (c) {
            a.extend(b, c);
        }
        b.widgetId = Math.round(Math.random() * 10000);
        this.each(function () {
            var d = new MMM.SocialWidget(this, b);
        });
        return this;
    };
})(jQuery);

if (typeof (MMM.Feed) === "undefined") {
    MMM.Feed = {};
}

MMM.Feed.BaseFeed = Class.extend({
    config: {
        url: false,
        accountUrl: false
    },
    widgetId: 0,
    normalizedPosts: [{
        id: "",
        name: "",
        datetime: 0,
        text: "",
        link: "",
        thumbnail: "",
        service: "",
        accountUrl: ""
    }],
    init: function (a, b) {
        $.extend(this.config, a);
        this.widgetId = b;
        this.getFeed();
    },
    getFeed: function () {
        if (!this.config.url) {
            return false;
        }
        var a = this;
        $.ajax({
            url: this.config.url,
            dataType: "html",
            data: {},
            success: function (b) {
                if (typeof (b) == "string") {
                    try {
                        b = b.replace(/(\n|\t)/g, "");
                        b = $.parseJSON(b.replace(/\\'/g, "'"));
                    } catch (c) {}
                }
                a.parseFeed(b);
            },
            error: function (c, b, d) {
                console.log("ERROR", d);
            }
        });
    },
    parseFeed: function () {},
    truncateString: function (b, a) {
        if (!b) {
            return "";
        }
        b = b.replace(/\s+/g, " ");
        if (b.length < a) {
            return b;
        }
        if (b.charAt(a - 1) == " ") {
            return $.trim(b.substr(0, a)) + "...";
        }
        return $.trim(b.substr(0, a)).replace(/(.*)\s+\S+/, "$1") + "...";
    }
});
MMM.Feed.Facebook = MMM.Feed.BaseFeed.extend({
    config: {},
    init: function (a, b) {
        this._super(a, b);
    },
    parseFeed: function (b) {
        var a = this;
        this.normalizedPosts = [];
        $(b.data).each(function (d, j) {
            if (j.from.id !== a.config.onlyShowFromUserId) {
                return;
            }
            var f = j.created_time.replace(/\+\d{4}$/, "").split("T");
            var e = f[0].split("-");
            var g = f[1].split(":");
            var h = new Date(e[0], parseInt(e[1], 10) - 1, e[2], g[0], g[1], g[2]);
            var c = {};
            c.id = j.id;
            c.name = j.name;
            c.dateTime = h.getTime();
            c.text = a.parseText(j.message);
            c.link = j.link;
            c.thumbnail = j.picture;
            c.accountUrl = a.config.accountUrl;
            c.service = "Facebook";
            a.normalizedPosts.push(c);
        });
        $(document).trigger("social-widget-feed-update-" + this.widgetId, [this.normalizedPosts]);
    },
    parseText: function (a) {
        a = this.truncateString(a, 140);
        a = a.replace(/(http\S+)/g, '<a href="$1" target="_blank">$1</a>');
        if (this.config.removeFromDescription) {
            a = a.replace(this.config.removeFromDescription, "");
        }
        return a;
    }
});
MMM.Feed.Flickr = MMM.Feed.BaseFeed.extend({
    config: {},
    init: function (a, b) {
        this._super(a, b);
    },
    parseFeed: function (b) {
        var a = this;
        this.normalizedPosts = [];
        $(b.items).each(function (d, j) {
            var f = j.published.replace("Z", "").split("T");
            var e = f[0].split("-");
            var g = f[1].split(":");
            var h = new Date(e[0], parseInt(e[1], 10) - 1, e[2], g[0], g[1], g[2]);
            var c = {};
            c.id = j.link.replace(/.*(\d{6,}).*/, "$1");
            c.name = j.title;
            c.dateTime = h.getTime();
            c.text = a.parseText(j.description);
            c.link = j.link;
            c.thumbnail = a.parseThumbnail(j.description);
            c.accountUrl = a.config.accountUrl;
            c.service = "Flickr";
            a.normalizedPosts.push(c);
        });
        $(document).trigger("social-widget-feed-update-" + this.widgetId, [this.normalizedPosts]);
    },
    parseText: function (b) {
        var a = document.createElement("div");
        $(a).html(b);
        b = $(a).find("p:first").text();
        b = this.truncateString(b, 140);
        b = b.replace(/(http\S+)/g, '<a href="$1" target="_blank">$1</a>');
        if (this.config.removeFromDescription) {
            b = b.replace(this.config.removeFromDescription, "");
        }
        return b;
    },
    parseThumbnail: function (b) {
        var a = document.createElement("div");
        $(a).html(b);
        b = $(a).find("p:nth-child(2) img:first").attr("src");
        return b;
    }
});
MMM.Feed.Twitter = MMM.Feed.BaseFeed.extend({
    config: {},
    init: function (a, b) {
        this._super(a, b);
    },
    parseFeed: function (b) {
        var a = this;
        this.normalizedPosts = [];
        $(b).each(function (e, k) {
            var c = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var g = k.created_at.split(" ");
            var f = g[0].split("0");
            var h = g[3].split(":");
            var j = new Date(g[5], $.inArray(g[1], c), g[2], h[0], h[1], h[2]);
            var d = {};
            d.id = k.id;
            d.name = '<a class="social-widget-twitter-account-link" href="http://twitter.com/' + k.user.screen_name + '" target="_blank">' + k.user.screen_name + "</a>";
            d.dateTime = j.getTime();
            d.text = a.parseText(k.text);
            d.link = "http://twitter.com/" + k.user.screen_name + "/status/" + k.id;
            d.thumbnail = "";
            d.accountUrl = a.config.accountUrl;
            d.service = "Twitter";
            a.normalizedPosts.push(d);
        });
        $(document).trigger("social-widget-feed-update-" + this.widgetId, [this.normalizedPosts]);
    },
    parseText: function (a) {
        a = this.truncateString(a, 140);
        a = a.replace(/(http\S+)/g, '<a href="$1" target="_blank" class="social-widget-twitter-text-link">$1</a>');
        a = a.replace(/\@(\S+)/g, '<a href="http://twitter.com/$1" target="_blank" class="social-widget-twitter-user-reference-link">@$1</a>');
        if (this.config.removeFromDescription) {
            a = a.replace(this.config.removeFromDescription, "");
        }
        return a;
    }
});
MMM.Feed.YouTube = MMM.Feed.BaseFeed.extend({
    config: {},
    init: function (a, b) {
        this._super(a, b);
    },
    parseFeed: function (b) {
        var a = this;
        this.normalizedPosts = [];
        $(b.feed.entry).each(function (d, j) {
            var f = j.published.$t.replace(/\.\d{3}Z$/, "").split("T");
            var e = f[0].split("-");
            var g = f[1].split(":");
            var h = new Date(e[0], parseInt(e[1], 10) - 1, e[2], g[0], g[1], g[2]);
            var c = {};
            c.id = j.id.$t.replace(/.*[\/|:](.*?)$/, "$1");
            c.name = j.title.$t;
            c.dateTime = h.getTime();
            c.text = a.parseText(j.content.$t);
            c.link = j.link[0].href;
            c.thumbnail = a.parseThumbnail(j.content.$t);
            c.accountUrl = a.config.accountUrl;
            c.service = "YouTube";
            a.normalizedPosts.push(c);
        });
        $(document).trigger("social-widget-feed-update-" + this.widgetId, [this.normalizedPosts]);
    },
    parseText: function (b) {
        var a = document.createElement("div");
        $(a).html(b);
        b = $(a).find("table:first tr:first td:nth-child(2) div:nth-child(2)").text();
        b = this.truncateString(b, 140);
        b = b.replace(/(http\S+)/g, '<a href="$1" target="_blank">$1</a>');
        if (this.config.removeFromDescription) {
            b = b.replace(this.config.removeFromDescription, "");
        }
        return b;
    },
    parseThumbnail: function (b) {
        var a = document.createElement("div");
        $(a).html(b);
        b = $(a).find("table:first tr:first td:first img:first").attr("src");
        return b;
    }
});
MMM.SocialWidget = Class.extend({
    config: {
        refreshTime: 15,
        height: 400,
        widgetId: 0,
        filterLabel: "Show me:",
        errorMessage: "No posts available.",
        theme: "social-widget-theme-default"
    },
    feeds: [],
    items: [],
    container: null,
    updateContainerHeightOffsets: ["paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth"],
    widgetTemplate: '<div class="social-widget %theme%">' + '<div class="social-widget-header">' + '<div class="social-widget-filters">' + '<form class="social-widget-form">' + '<ul class="social-widget-filter-buttons"></ul>' + '<div class="social-widget-button-label">%filterLabel%</div>' + "</form>" + "</div>" + "</div>" + '<div class="social-widget-updates-wrapper">' + '<div class="social-widget-updates"></div>' + "</div>" + "</div>",
    buttonTemplate: '<li class="social-widget-feed-button-%service%">' + '<label for="radio-social-widget-service-%service%">%service%</label>' + '<input type="radio" name="social-widget-service" id="radio-social-widget-service-%service%" />' + "</li>",
    itemTemplate: '<div class="social-widget-item service-%service%">' + '<a class="social-widget-service-icon social-widget-service-icon-%service% social-widget-service-icon-%service%-%id%" href="%accountUrl%" target="_blank">%service%</a>' + '<div class="social-widget-item-content">' + '<div class="social-widget-thumbnail">' + '<a href="%link%" target="_blank" class="social-widget-thumbnail-link social-widget-thumbnail-link-%service% social-widget-thumbnail-link-%service%-%id%"><img src="%thumbnail%" /></a>' + "</div>" + '<div><span class="social-widget-item-name"><a href="%link%" target="_blank" class="social-widget-name-link social-widget-name-link-%service% social-widget-name-link-%service%-%id%">%name%</a></span>' + '<span class="social-widget-item-text">%text%</span>' + '<a class="social-widget-item-link social-widget-item-link-%service% social-widget-item-link-%service%-%id%" href="%link%" target="_blank">View&nbsp;&rsaquo;</a>' + '<div class="social-widget-item-datetime">%datetime%</div></div>' + "</div>" + "</div>",
    init: function (a, b) {
        $.extend(this.config, b);
        this.container = $(a);
        this.injectWidget();
        this.fitWidget();
        for (var c in b.feeds) {
            if (MMM.Feed.hasOwnProperty(c)) {
                this.attachFeed(new MMM.Feed[c](b.feeds[c], this.config.widgetId));
                this.addFeedButton(c);
            }
        }
        this.addFeedButton("All");
        this.attachListeners();
    },
    injectWidget: function () {
        var a = this.widgetTemplate;
        a = a.replace(/%theme%/g, this.config.theme);
        a = a.replace(/%filterLabel%/g, this.config.filterLabel);
        this.container.html(a);
    },
    fitWidget: function () {
        this.container.find(".social-widget-updates").css("height", this.config.height);
    },
    attachFeed: function (a) {
        this.feeds.push(a);
    },
    addFeedButton: function (a) {
        var b = this.buttonTemplate.replace(/%service%/g, a);
        this.container.find(".social-widget-filter-buttons").append(b);
    },
    attachListeners: function () {
        var a = this;
        this.container.find(".social-widget-filter-buttons li label").click(function (b) {
            a.handleFilterClick(b);
        });
        $(document).bind("social-widget-feed-update-" + this.config.widgetId, function (b, c) {
            a.handleFeedUpdate(b, c);
        });
    },
    handleFilterClick: function (a) {
        a.preventDefault();
        this.filter($(a.target).attr("for").replace("radio-social-widget-service-", ""));
    },
    handleFeedUpdate: function (a, b) {
        this.items = this.items.concat(b);
        this.sortItems();
        this.showItems();
    },
    sortItems: function () {
        this.items.sort(function (d, c) {
            if (d.dateTime > c.dateTime) {
                return -1;
            } else {
                if (d.dateTime < c.dateTime) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    },
    showItems: function () {
        var a = this;
        this.container.find(".social-widget-updates").html("");
        $(this.items).each(function (g, l) {
            var f = a.itemTemplate;
            var j = new Date();
            j.setTime(l.dateTime);
            var d = "am";
            var h = j.getHours();
            if (j.getHours() > 11) {
                d = "pm";
                h = h - 12;
            }
            if (h == 0) {
                h = 12;
            }
            f = f.replace(/%datetime%/, j.toDateString() + " " + h + ":" + j.getMinutes().toString().replace(/^(\d{1})$/, "0$1") + d);
            for (var e in l) {
                if (l.hasOwnProperty(e)) {
                    var c = new RegExp("%" + e + "%", "g");
                    if (!l[e]) {
                        l[e] = "";
                    } else {
                        f = f.replace("social-widget-item ", "social-widget-item has-" + e + " ");
                    }
                    f = f.replace(c, l[e]);
                }
            }
            f = f.replace(/<img.*?src="".*?\/>/gi, "");
            a.container.find(".social-widget-updates").append(f);
        });
        var b = this.itemTemplate;
        b = b.replace(/%service%/g, "Error");
        b = b.replace(/%text%/g, this.config.errorMessage);
        b = b.replace(/%thumbnail%/g, "");
        b = b.replace("social-widget-item ", "social-widget-item inactive ");
        this.container.find(".social-widget-updates").append(b);
        this.container.find("*[src=], *[href=].social-widget-item-link").css("display", "none");
    },
    filter: function (a) {
        if (!a || (a !== "All" && !this.config.feeds.hasOwnProperty(a))) {
            console.log("service not filterable:", a);
            return false;
        }
        this.indicateFilter(a);
        this.filterItems(a);
        this.showErrors();
    },
    indicateFilter: function (a) {
        if (a === "All") {
            this.container.find(".social-widget-filter-buttons li label").removeClass("inactive");
        } else {
            this.container.find(".social-widget-filter-buttons li label").addClass("inactive");
            this.container.find(".social-widget-filter-buttons li label[for=radio-social-widget-service-" + a + "], social-widget-filter-buttons li label[for=radio-social-widget-service-All]").removeClass("inactive");
        }
    },
    filterItems: function (a) {
        var b = this.container.find(".social-widget-item");
        b.removeClass("inactive");
        if (a !== "All") {
            b = b.not(".service-" + a);
            b.addClass("inactive");
        }
    },
    showErrors: function () {
        if (this.container.find(".social-widget-item").not(".inactive").length == 0) {
            this.container.find(".service-Error").removeClass("inactive");
        } else {
            this.container.find(".service-Error").addClass("inactive");
        }
    }
});