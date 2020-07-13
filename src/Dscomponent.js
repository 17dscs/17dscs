import Dsc4 from "./components/Dsc4";

export default class Dscomponent {
  $container;
  $target;
  constructor(name) {
    const $container = document.getElementById(`${name}`);
    this.$container = $container;
    this.$target = null;

    if ($container) this.$target = new Dsc4(this.$container);
  }
}
