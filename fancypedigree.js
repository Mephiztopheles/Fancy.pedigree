(function ( Fancy ) {
    var NAME = "FancyPedigree";

    function FancyPedigree( element, settings ) {
        var SELF       = this;
        this.element   = element;
        this.data      = {};
        this.templates = [];
        this.settings  = $.extend( {}, Fancy.settings[ NAME ], settings );
        var qAjax      = Fancy.promise(),
            qTemplate  = Fancy.promise();
        $.ajax( {
            url     : Fancy.url( this.settings.url ),
            dataType: "json",
            success : function ( data ) {
                SELF.data = data;
                qAjax.resolve( data );
            }, error: function ( xhr, status, error ) {
                qAjax.reject( error );
            }
        } );
        Fancy.loadTemplate( Fancy.url( this.settings.templatePath ) )( function ( data ) {
            qTemplate.resolve( data );
        } );

        Fancy.promise.all( [ qTemplate, qAjax ] ).then( function ( template ) {
            var clone = template[ 0 ].clone();
            SELF.element.append( clone );
            SELF.compile( clone, SELF.settings.mainHorseName );
        }, function () {
            Fancy.debug( arguments );
        } );
        return this;
    }


    function FancyEachDirective( template, scope ) {

    }

    FancyPedigree.api = FancyPedigree.prototype = {};
    FancyPedigree.api.compile = function ( template, name ) {
        this.templates.push( new Fancy( template ).template( { scope: { item: this.data[ name ] } } ).compile() );
    };

    Fancy.settings[ NAME ] = {
        url             : "/data.json",
        templatePath    : "/template/entity.html",
        mainHorseName   : "horse",
        fatherHorseName : "father",
        motherHorseName : "mother",
        siblingHorseName: "siblings",
        data            : {}
    };

    Fancy.api.pedigree = function ( settings ) {
        return this.set( NAME, function ( element ) {
            return new FancyPedigree( element, settings );
        }, true );
    };
})( Fancy );