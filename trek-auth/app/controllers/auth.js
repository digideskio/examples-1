
export default {

  * login() {
    if (this.isAuthenticated()) {
      return this.redirect('/');
    }
    yield this.render('auth/login', {
      errors: this.flash('error'),
      providers:this.config.get('passport.list')
    });
  },

  // singout
  * logout() {
    this.logout();
    this.redirect('/');
  },

  // signup
  * register() {
    if (this.isAuthenticated()) {
      return this.redirect('/');
    }
    yield this.render('auth/register', {
      errors: this.flash('error')
    });
  },

  * provider(next) {
    let provider = this.params.provider || 'local';
    // Ignore local and `GET` HTTP verb.
    if (this.method !== 'POST' && provider === 'local') return this.redirect('/login');
    let passport = this.app.getService('passport');
    yield passport.endpoint(this, provider);
    //yield next;
  },

  * callback(next) {
    let flashError = this.flash('error')[0];
    let provider = this.params.provider || 'local';
    let action = this.params.action;
    if (this.method !== 'POST' && provider === 'local') return this.redirect('/signup');
    let passport = this.app.getService('passport');
    let result = yield passport.callback(this, provider, action);
    if (result && !result.error && result.user) {
      yield this.login(result.user);
      return this.redirect('/');
    }
    if (result && result.error) {
      this.flash('error', result.error);
    }
    switch(action) {
      case 'register':
        this.redirect('/signup')
        return;
      case 'disconnect':
        this.redirect('back')
        return;
      default:
        this.redirect('/login')
        return;
    }
  },

  * disconnect() {

  }

};