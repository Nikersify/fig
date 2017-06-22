import test from 'ava'

import {
	isPromise,
	noop,
	randString,
	walk
} from '../../src/internal/util'

test('isPromise', t => {
	t.true(isPromise(new Promise(() => {})))
	t.false(isPromise({
		then: () => {},
		catch: () => {}
	}))
	t.false(isPromise(null))
	t.false(isPromise(42))
})

test('randString', t => {
	t.is(randString().length, 8, '8 is the default length')
	t.not(randString(32), randString(32), 'returns random values')
	t.is(randString(1).length, 1, 'length of one')
	t.is(randString(6969).length, 6969, 'length of a lot')
	t.is(randString(0).length, 0, 'zero length')
})

test('walk', t => {
	const input = {
		foo: 10,
		bar: 20,
		baz: {
			top: 40,
			pot: 80,
			ast: {
				oof: 120,
				rab: 150
			}
		}
	}

	const output = {
		foo: 20,
		bar: 40,
		baz: {
			top: 80,
			pot: 160,
			ast: {
				oof: 240,
				rab: 300
			}
		}
	}

	const visitor = (o, arg1, arg2, arg3) => {
		if ([arg1, arg2, arg3].join(' ') !== 'this is patrick')
			throw 'arguments not being passed to visitor'

		for (const key in o) {
			if (o.hasOwnProperty(key) && typeof o[key] === 'number') {
				o[key] = o[key] * 2
			}
		}
	}

	walk(visitor, input, 'this', 'is', 'patrick')

	t.deepEqual(input, output)
})

test('noop', t => {
	t.notThrows(noop.bind(null, 'hue'), 'does nothing')
})