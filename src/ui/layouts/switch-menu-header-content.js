// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

(function( scope ) {

    /**
     * the switchlayout template
     * @type {string}
     */
    var switchTemplate = M.SwitchLayout.prototype.template;
    /**
     * the header template
     * @type {string}
     */

    var headerTemplate = M.HeaderLayout.prototype.template;
    /**
     * add a header to the both content container
     * @type {string}
     */
    var myTemplate = switchTemplate.replace(/m-page-1">/gi, 'm-page-1">' + headerTemplate.replace(/data-childviews="header"/gi, 'data-childviews="content_page1_header"'));
    myTemplate = myTemplate.replace(/m-page-2">/gi, 'm-page-2">' + headerTemplate.replace(/data-childviews="header"/gi, 'data-childviews="content_page2_header"'));

    /**
     * A Switchlayout with a header and content
     * @type {*|Object|void}
     */
    M.SwitchMenuHeaderContentLayout = M.SwitchHeaderContentLayout.extend({

        _type: 'M.SwitchHeaderContentLayout',

        /**
         * the template - a combination of the header and switch template
         * @type {string}
         */
        template: myTemplate,

        cssClass:'switch-menu-header-content-layout',

        menu: null,

        /**
         * The content gets mapped to the DOM via the Switchlayout. Then map the header to the Layout.
         * @param {Object} the views to display
         * @returns {SwitchHeaderContentLayout}
         */
        applyViews: function( settings ) {

            if( !this.menu ) {
                this.menu = M.MenuView.extend().create().render();
                this.$el.append(this.menu.$el);
            }
            var menuButton = M.ButtonView.extend();
            settings.header.addChildView('first', menuButton.create());

            M.SwitchHeaderContentLayout.prototype.applyViews.apply(this, [settings]);

            if(!this._firstRender){
                //insert the view
                this.$el.find('[data-childviews="menu-content"]').html(settings.menuContent.render().$el);
            }
            return this;
        }
    });

})(this);