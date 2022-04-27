class HelloController < ApplicationController
  def react
    @greet = params[:greet]
  end
end
