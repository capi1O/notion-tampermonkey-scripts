export const onUrlChange = (cb) => {
	const _push = history.pushState;
	const _replace = history.replaceState;

	history.pushState = function () {
		_push.apply(this, arguments);
		cb();
	};

	history.replaceState = function () {
		_replace.apply(this, arguments);
		cb();
	};

	window.addEventListener('popstate', cb);
};
