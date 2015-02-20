$(function() {
    function SpoolManagementViewModel(parameters) {
        var self = this;

        console.log(parameters)

        self.SpoolManagementModel = parameters[0];
        self.settingsViewModel = parameters[1];

        self.placeholderName = ko.observable();
        self.placeholderAmountLeft = ko.observable();
        // self.placeholderDisplayName = ko.observable();
        // self.placeholderDescription = ko.observable();

        self.spoolName = ko.observable();
        self.amountLeft = ko.observable();

        self.saveButton = $("#settings-spool-management-add-start");

        self.spools = new ItemListHelper(
          "plugin_spool_management_spools",
          {
            "id": function(a, b) {
              return 0;
            },
            "name": function(a, b) {
              return 0;
            }
          },
          {},
          "id",
          [],
          [],
          5
        );

        self.showAddNewSpoolDialog = function() {
            $("#settings_plugin_spool_management_add").modal("show");
        };

        self.saveButton.on('click', function() {
          var data = {
            'plugins': {
              'spool_management': {
                'spools': []
              }
            }
          };

          // data['']
          var spool = {}
          spool['name'] = self.spoolName()
          spool['amount_left'] = self.amountLeft()

          data.plugins.spool_management.spools.push(spool)
          data.plugins.spool_management.method = 'patch'

          // var obj = $(data).serializeObject();

          var request = new XMLHttpRequest();
          // request.
          request.open("POST", "/api/settings?apikey=1234");
          request.setRequestHeader('Content-Type', 'application/json')

          request.onload = function(e) {
            // console.log(e)
            // JSON.parse(this.response).plugins.spool_management.spools
            self.fromResponse(JSON.parse(this.response));
            self.placeholderName(undefined);
            self.placeholderAmountLeft(undefined);
            self.spoolName(undefined);
            self.amountLeft(undefined);
            $("#settings_plugin_spool_management_add").modal("hide");
          }

          request.send(JSON.stringify(data));
// 
          
          // self.fileName(undefined);
          //       self.placeholderName(undefined);
          //       self.placeholderDisplayName(undefined);
          //       self.placeholderDescription(undefined);
          //       self.profileName(undefined);
          //       self.profileDisplayName(undefined);
          //       self.profileDescription(undefined);
          //       self.profileAllowOverwrite(true);

          //       $("#settings_plugin_cura_import").modal("hide");
          //       self.requestData();
          //       self.slicingViewModel.requestData();
        });

        self.requestData = function() {
            $.ajax({
                url: API_BASEURL + "settings",
                type: "GET",
                dataType: "json",
                success: self.fromResponse
            });
        };

        self.fromResponse = function(data) {
          var spools = [];
          var data = data.plugins.spool_management.spools;
          // debugger
          _.each(_.keys(data), function(key) {
            console.log(key)
            spools.push({
              // id: ko.observable(data[key].id),
              name: ko.observable(data[key].name),
              amount_left: ko.observable(data[key].amount_left),
              description: ko.observable(''),
              isEnabled: ko.observable(data[key].default),
              // isdefault: ko.observable(data[key],
              // resource: ''
            })
          })
          self.spools.updateItems(spools)
        };

        // self.fromResponse = function(data) {
        //     var profiles = [];
        //     _.each(_.keys(data), function(key) {
        //         profiles.push({
        //             key: key,
        //             name: ko.observable(data[key].displayName),
        //             description: ko.observable(data[key].description),
        //             isdefault: ko.observable(data[key].default),
        //             resource: ko.observable(data[key].resource)
        //         });
        //     });
        //     self.profiles.updateItems(profiles);
        // };

        self.onBeforeBinding = function () {
            self.settings = self.settingsViewModel.settings;
            self.requestData();
        };
    }

    ADDITIONAL_VIEWMODELS.push([
       SpoolManagementViewModel,
       ["temperatureViewModel", "settingsViewModel"],
       document.getElementById('settings_plugin_spool_management')
    ])
})
