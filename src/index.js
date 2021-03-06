import Chain from './class/chain'
import Emitter from './class/emitter'
import logging from './class/logger'
import mount from './dom/mount'
import update from './dom/update'
import use from './misc/use'
import watch from './misc/notifier'
import {randString} from './util'

const log = logging('app')

const DEFAULTS = {
	debug: false
}

class Fig {
	constructor(opts) {
		this._opts = opts

		logging.enabled = this._opts.debug

		log.info('initializing with config', this._opts)

		this.state = {}
		this.ref = {}

		this._components = new Map()
		this._id = randString()
		this._bus = new Emitter()

		this.on = this._bus.on.bind(this._bus)
		this.off = this._bus.off.bind(this._bus)
		this.once = this._bus.once.bind(this._bus)
		this.emit = this._bus.emit.bind(this._bus)

		watch(this, 'state', () => {
			if (this._$root) {
				logging('notifier').info('state changes detected, updating...')

				this.emit('fig update pre')

				update(this._$root, this.state,	this._components, this.emit,
					this.ref)

				this.emit('fig update')
			}
		})

		this._chain = new Chain()
	}

	mount($el, name) {
		this._chain.defer(() => {
			this._$root = mount($el, this._components.get(name))

			update(this._$root, this.state,	this._components, this.emit,
				this.ref)
		})

		this._chain.defer(() => {
			this.emit('fig ready')
		})
	}

	update() {
		this._chain.defer(() => {
			update(this._$root, this.state,	this._components, this.emit,
				this.ref)
		})
	}

	use(comp, name) {
		this._chain.defer(() => {
			return use(comp, name, `fig-${this._id}-style`, this._components)
		})
	}
}

export default (opts = DEFAULTS) => {
	return new Fig(opts)
}
