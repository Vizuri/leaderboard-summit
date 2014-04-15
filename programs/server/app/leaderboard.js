(function(){/*jshint bitwise:true, browser:true, curly:true, eqeqeq:true, evil:true, forin:true, indent:2, latedef: true, maxerr:50, noarg:true, noempty:true, plusplus:true, regexp:false, undef:true, white:true */
/*global $, jQuery, _, Meteor, Session, Template, amplify */

// Set up a collection to contain provider information. On the server,
// it is backed by a MongoDB collection named "providers".

var Providers = new Meteor.Collection('providers');

var Leaderboard = {};
Leaderboard.resetProviders = function () {
  Providers.remove({});
  var names = [
    'Digital Ocean',
    'Rackspace Cloud',
    'Google Compute Engine',
    'Amazon Web Services',
    'Windows Azure',
    'My Awesome VM'
  ];
  for (var i = 0; i < names.length; i += 1) {
    Providers.insert({name: names[i], score: 0});
  }
};
Leaderboard.addPlayer = function (provider_name) {
  var trimmed = $.trim(provider_name);
  if (trimmed.length) {
    Providers.insert({name: trimmed, score: 0});
  }
};

if (Meteor.isClient) {

  // A version of Session that also store the key/value pair to local storage
  // using Amplify
  var AmplifiedSession = _.extend({}, Session, {
    keys: _.object(_.map(amplify.store(), function (value, key) {
      return [key, JSON.stringify(value)];
    })),
    set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
  });

  Template.navbar.sort_by_is = function (sort_by) {
    return (AmplifiedSession.get('sort_by') || 'score') === sort_by;
  };
  Template.navbar.events({
    'click .sort_by_score': function () {
      AmplifiedSession.set('sort_by', 'score');
    },
    'click .sort_by_name': function () {
      AmplifiedSession.set('sort_by', 'name');
    },
    'click .reset': function () {
      Leaderboard.resetProviders();
    },
    'click .add_user': function (event, template) {
      var provider = template.find('input.provider_name');
      Leaderboard.addPlayer(provider.value);
      provider.value = '';
    }
  });

  Template.leaderboard.providers = function () {
    var sort_by = AmplifiedSession.get('sort_by');
    var sort_options = sort_by === 'name' ? {name: 1, score: 1} : {score: -1, name: 1};
    return Providers.find({}, {sort: sort_options});
  };

  Template.provider.selected = function () {
    return AmplifiedSession.equals('selected_provider', this._id);
  };
  Template.provider.is_max = function () {
    var max = Providers.findOne({}, {sort: {'score': -1, name: 1}});
    return max && max._id === this._id;
  };
  Template.provider.is_min = function () {
    var min = Providers.findOne({}, {sort: {'score': 1, name: -1}});
    return min && min._id === this._id;
  };
  Template.provider.events({
    'click .increment': function () {
      Providers.update(this._id, {$inc: {score: 5}});
      return false;
    },
    'click .decrement': function () {
      Providers.update(this._id, {$inc: {score: -5}});
      return false;
    },
    'click': function () {
      AmplifiedSession.set('selected_provider', this._id);
    }
  });
  Template.provider.rendered = function () {
    $(this.findAll('[rel=tooltip]')).tooltip();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // On server startup, create some providers if the database is empty.
    if (Providers.find().count() === 0) {
      Leaderboard.resetProviders();
    }
  });
}

})();
