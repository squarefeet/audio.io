// Create an audio effect class to hold shared effect
// functions...
audio.io.Effect = audio.io.Audio.extend({
	bypass: function( bool ) {
		// If bool is truthy and we're already
		// connected to the effect, go ahead and disconnect...
		if( bool && this.active ) {
			this.input.disconnect( this.effect );
			this.input.connect( this.output );
			this.active = 0;
		}

		// ...Alternatively, connect the output if it's not already
		// connected
		else if( !bool && !this.active ) {
			this.input.disconnect( this.output );
			this.input.connect( this.effect );
			this.active = 1;
		}
	},

	connectMod: function( modSource, param ) {
		if( this.effect[param] ) {
			console.log(modSource)
			modSource.output.connect( this.effect[param] );
		}
	}
});



audio.io.Filter = audio.io.Effect.extend({
	initialize: function(type, cutoff, res, gain) {
		this.effect = this._io.context.createBiquadFilter();

		this.setType( type );
		this.setCutoff( cutoff );
		this.setResonance( res || 5 );
		this.setGain( gain );

		// Connect input to filter
		this.input.connect( this.effect );

		// ... and the filter to the output.
		this.effect.connect( this.output );

		// Mark this Node as active, so if/when .bypass() is called
		// it will behave as expected.
		this.active = 1;

		console.log(this.effect);
	},

	setType: function( type ) {
		var hasType = this._io.filterTypes.indexOf( type );

		// Default to lowpass if invalid type provided.
		this.type = ~hasType ? hasType : 0;

		this.effect.type = this.type;
	},
	setCutoff: function( value ) {
		this.effect.frequency.value = +value;
	},
	setResonance: function( value ) {
		this.effect.Q.value = +value;
	},
	setGain: function( value ) {
		this.effect.gain.value = +value;
	}
});



audio.io.Reverb = audio.io.Effect.extend({

});