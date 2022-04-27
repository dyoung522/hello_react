# Rails 7 + Stimulus + ReactJS + TailwindCSS

This will explain how to bootstrap a Rails v7 app with ReactJS v18

This document assumes you have the dependencies needed already installed and ready to go.
Installing them is already well documented elsewhere, so consult Google if you need help getting to this point.

Our dependencies include (but may not be limited to):

- Ruby 3.x
- `bundler` gem
- `rails` 7.x gem
- Latest NodeJS (for npm)
- [optionally] `yarn` (default JS package manager for Rails)

## Initialize the App

### Rails.new

Your typical `rails new` install to get us going. Just for fun, we're calling this app `HelloReact`

Additionally, I'm using [TailwindCSS](https://tailwindcss.com/docs/installation) in this tutorial, but you're free to use any CSS framework you desire.

> NOTE!
> Details on how to use TailwindCSS is out of scope for this document. It's mentioned here because we're going to install it as part of `rails new` and the React component will be using it for styling.

```shell
rails new -j esbuild -c tailwind hello_react
cd hello_react
```

### Install React

```shell
yarn add react react-dom prop-types
```

### Babel Packages

```shell
yarn add --dev @babel/core @babel/preset-env @babel/preset-react
```

## Configuration

### Babel

In your app's root directory, create   `babel.config.js`  with the following

```js
module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
};
```

### TailwindCSS

Since this document is using TailwindCSS, we'll need to tell it to compile `.jsx` files.

Open `tailwind.config.js` and modify it so it matches the following

```js
module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.{js,jsx}'
  ]
}
```

### Create the `hello/react` Rails Controller

```shell
rails g controller hello react
```

This is standard Rails and sets up the Rails `hello_controller` along with a route for `hello/react`

## Checkpoint 1

At this point, your rails app should be functional. Run `bin/dev` to start up the development server environment and visit [localhost:3000/hello/react](http://localhost:3000/hello/react)

You should see the default "Rails" defined HTML

```html
# Hello#react

Find me in app/views/hello/react.html.erb
```

If so, congrats, continue to the next step. If not, something went wrong above, please check each step carefully and try again.

## Wiring Stimulus to React

Now we're on to the fun bits… we're going to create our Hello React component, complete with a dynamic entry to show how we can easily pass in dynamic data from rails into our component.

### Create Hello Component

- In your favorite editor, navigate to `app/javascript` and create a directory named `components` (this is where we'll store our React components)
- Create `app/javascript/components/Hello.jsx`  and add the following code

```javascript
import * as React from "react";
import PropTypes from "prop-types";

const Hello = ({ greet }) => {
  return (
    <div className="flex justify-center">
      <div className="text-center items-center">
        <p className="py-16 text-2xl text-red-500">Hello {greet || "World"}!</p>
      </div>
    </div>
  );
};

Hello.propTypes = {
  greet: PropTypes.string
};

export default Hello;
```

We'll be passing in the `greet` prop directly from Rails later on… hang tight!

### Create or Update the Stimulus Hello Controller

the `rails new` command may have already created the file `app/javascript/controllers/hello_controller.js`, but if not, create it with:

```shell
rails g stimulus hello
```

Either way, do this next step:

> IMPORTANT!
> - You will now have a file named `app/javascript/controllers/hello_controller.js`, however, because we're using ReactJS, we need it to be a `.jsx` file.
> Rename the file to `app/javascript/controllers/hello_controller.jsx`
> - Run `rails stimulus:manifest:update` to reflect this change.

### Update `hello/react.html.erb`

We need to modify the `app/views/hello/react` view file to wire up our new Stimulus controller

```ruby
<div data-controller="hello">
</div>
```

`data-controller` tells Stimulus which controller this should be wired up to use.

### Update `hello_controller.jsx`

This is where the magic happens!

Edit `app/javascript/controllers/hello_controller.jsx` to include the following

```js
import * as React from "react";
import { Controller } from "@hotwired/stimulus";
import { createRoot } from "react-dom/client";
import Hello from "../components/Hello";

export default class extends Controller {
  connect() {
    createRoot(this.element).render(<Hello />);
  }
}
```

> IMPORTANT!
> `createRoot` is part of React v18 and `this.element` contains the current HTML element we've attached our Stimulus controller to. This is what glues Stimulus and React together.

## Checkpoint 2

Run `bin/dev` to start up this rails development server environment.

There shouldn't be any errors in the output. If there are, fix them and try again.

Visit  [localhost:3000/hello/react](http://localhost:3000/hello/react) once again, but this time see our React component's output!

```
Hello World!
```

Yay! We've successfully wired up Rails to ReactJS via Stimulus!

You can stop here if you want, but next, I'll explain how to pass data from Rails directly into our React component via props.

## Passing Data Directly From Rails to React

We're now going to wire up Rails to pass data directly to React via stimulus.

### Update Rails Controller

Edit `app/controllers/hello_controller.rb` to modify the `react` method to define an instance variable for us to use.

```ruby
class HelloController < ApplicationController
  def react
    @greet = params[:greet]
  end
end
```

### Update Rails View File

Update `app/views/hello/react.html.erb` to include the `data-hello-greet-value` data element.

This tells Stimulus how to pass this data into our Stimulus controller.

```ruby
<div data-controller="hello" data-hello-greet-value="<%= @greet %>">
</div>
```

### Update the Stimulus Controller

```javascript
import * as React from "react";
import { Controller } from "@hotwired/stimulus";
import { createRoot } from "react-dom/client";
import Hello from "../components/Hello";

export default class extends Controller {
  static values = { greet: String };

  connect() {
    createRoot(this.element).render(<Hello greet={this.greetValue} />);
  }
}
```

- The `static values …` line is part Stimulus and abstracts any `data-` elements into objects for us to use. In this case, a String named `greet`.
- In turn, this is exposed to us via `this.greetValue`

## Fini

At this point  [localhost:3000/hello/react?greet=React](http://localhost:3000/hello/react?greet=React) should display whatever we've put in the `greet` param.

```html
Hello React!
```

Congrats! You now know how to mount React components onto any Rails view and pass data directly via React props.

Of course, this was a simple example, but you should be able to pass entire data structures this way without needing to use API calls.

However, there are some caveats. For instance, writing data back to Rails still requires an API call, but

```ad-note
title: Next Up

I plan on exploring more of the mechanisms within Stimulus, notably to figure out how we might also pass data back to Rails from React without using an external API call.
```

### Additional Resources

- [Rails](https://guides.rubyonrails.org/)
- [StimulusJS](https://stimulus.hotwired.dev/handbook/introduction)
- [ReactJS](https://reactjs.org/docs/getting-started.html)
- [TailwindCSS](https://tailwindcss.com/docs/installation)
