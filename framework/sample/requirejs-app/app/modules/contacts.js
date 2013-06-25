define([
    // Application.
    'app', 'backbone.stickit', "text!templates/detail.html", "text!templates/item.html", "text!templates/add.html"
],

    function( app, stickit, detailTemplate, itemTemplate, addTemplate ) {

        var Contact = app.module();

        Contact.Model = M.Model.extend({
            idAttribute: '_id',
            defaults: {
                firstname: '',
                lastname: ''
            },

            validate: function( attrs, options ) {
                if( attrs.firstname.length == 0 ) {
                    return "Firstname  is missing!"
                }
                if( attrs.lastname.length == 0 ) {
                    return "Lastname  is missing!"
                }
            }
        });

        Contact.Collection = M.Collection.extend({
            model: Contact.Model,
            url: 'http://nerds.mway.io:8100/contact'
        });

        Contact.Views.Item = Backbone.View.extend({

            template: _.template(itemTemplate),
            tagName: 'tr',
            className: 'contact-container',

            bindings: {
                '.firstname': {
                    observe: 'firstname'
                },
                '.lastname': {
                    observe: 'lastname'
                },
                '.id': {
                    observe: '_id'
                },
                'h1': {
                    observe: ['firstname', 'lastname'],
                    onGet: function( values ) {
                        return values[0] + ' - ' + values[1]
                    }
                }
            },

            events: {
                'tap': 'userSelected'
            },

            //USE THIS WITH STANDARD BACKBONE OR HAMMER JS
            //            events: {
            //                "tap": "userSelected",
            //                "click": "clickuserSelected"
            //            },

            clickuserSelected: function( a, b, c ) {

                //Backbone.history.navigate('detail/' + this.model.id, true);
                //  console.log('click auf elem');
                $('#log').append('click auf elem <br>');
                a.preventDefault();
                a.stopPropagation();
            },

            userSelected: function( a, b, c ) {
                Backbone.history.navigate('detail/' + this.model.id, true);
            },

            initialize: function() {
                this.MID = M.ViewManager.getNewId();
                this.model.on('destroy', this.destroy, this);
            },

            getEventHandler: function( a ) {
                var that = this;
                return function() {
                    that.userSelected();
                }
            },

            getId: function() {
                return this.MID;
            },

            beforeRender: function() {
                return this;
            },

            afterRender: function() {
                this.$el.attr('id', this.getId());
                this.stickit();
                return this;
            },

            destroy: function() {
                this.unstickit();
                this.remove();
            },

            serialize: function() {
                return this.model.attributes;
            }
        });

        Contact.Views.List = Backbone.View.extend({
            template: 'list',

            events: {
                "tap .add": "addEntry"
            },

            initialize: function() {
                this.listenTo(this.options.contacts, 'add', this.addOne);
                this.listenTo(this.options.contacts, 'fetch', function() {
                    this.addAll();
                });

                this.listenToOnce(this.options.contacts, 'sync', function() {
                    this.render();
                });
            },

            serialize: function() {
                return this.options
            },

            addEntry: function() {
                Backbone.history.navigate('add', true);
            },

            beforeRender: function() {
                this.addAll();
            },

            addOne: function( model, render ) {
                var view = this.insertView('tbody', new Contact.Views.Item({ model: model }));

                // Only trigger render if it not inserted inside `beforeRender`.
                if( render !== false ) {
                    view.render();
                }
            },

            addAll: function() {
                this.options.contacts.each(function( model ) {
                    this.addOne(model, false);
                }, this);
            }
        });

        Contact.Views.Detail = Backbone.View.extend({
            first: true,

            template: _.tpl(detailTemplate),

            events: {
                "tap .back": "back",
                "tap .delete": "deleteEntry",
                "tap .edit": "editEntry"
            },

            bindings: {
                '[data-binding="firstname"]': {
                    observe: 'firstname'
                },
                '[data-binding="input-firstname"]': {
                    observe: 'firstname'
                }
            },

            initialize: function() {
                this.listenTo(this.model, 'change', this.change);
            },

            // provide data to the template
            serialize: function() {
                return this.model.attributes
            },

            back: function() {
                this.$el.remove();
                Backbone.history.navigate("/", true);
            },

            deleteEntry: function() {
                var that = this;
                this.unstickit();
                this.model.destroy({
                    success: function() {
                        that.back();
                    }
                });
            },

            editEntry: function() {
                this.model.save();
                this.back();
            },

            afterRender: function() {
                this.stickit();
                return this;
            }
        })


        Contact.Views.Add = Backbone.View.extend({
            first: true,

            template: _.tpl(addTemplate),

            events: {
                "tap .back": "back",
                "tap .save": "saveEntry"
            },

            back: function() {
                this.$el.remove();
                Backbone.history.navigate("/", true);
            },

            saveEntry: function() {
                var that = this;

                var model = Contact.Model.create({
                    firstname: this.$('.firstname').val(),
                    lastname: this.$('.lastname').val()
                })

                if( !model.isValid() ) {
                    alert(model.validationError)
                } else {
                    this.collection.create(model, {
                        success: function() {
                            that.back();
                        }
                    })
                }


            }
        })

        // Required, return the module for AMD compliance.
        return Contact;

    });