class Confirmation {
  constructor() {
    this.overlay = null;
    this.text = null;
    this.cancelButton = null;
    this.confirmButton = null;

    this.confirmFn = () => {};
    this.cancelFn = () => {};
    this.message = "Are you sure?";
    this.confirmLabel = "Confirm";
    this.cancelLabel = "Cancel";
    this.#render();
    this.#bindEvents();
  }

  open({
    message = "Are you sure?",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmAction = () => {},
    cancelAction = () => {},
  } = {}) {
    // set up value
    this.confirmFn = confirmAction;
    this.cancelFn = cancelAction;
    this.message = message;
    this.confirmLabel = confirmLabel;
    this.cancelLabel = cancelLabel;
    this.#updateHTML();
    // show
    this.overlay.style.display = "block";
  }
  close() {
    // hide
    this.overlay.style.display = "none";
  }

  #render() {
    // find container
    let mountPoint = document.getElementById("Confirmation-confirmation");
    if (!mountPoint) {
      // console.error(
      //   '⚠️ Missing <div id="Confirmation-confirmation"></div> in HTML'
      // );
      // return;
      mountPoint = document.createElement("div")
      mountPoint.id = "Confirmation-confirmation"
      document.body.appendChild(mountPoint)
    }
    // inject
    mountPoint.innerHTML = `
            <div id="confirmationModalOverlay">
                <div id="confirmationModal">
                    <h1>Confirmation</h1>
                    <p id="confirmationText">${this.message}</p>
                    <div id="confirmationButton">
                        <button id="confirmationCancel" class="cancel-button">${this.cancelLabel}</button>
                        <button id="confirmationConfirm" class="confirm-button">${this.confirmLabel}</button>
                    </div>
                </div>
            </div>
        `;
    this.overlay = document.querySelector(
      "#Confirmation-confirmation #confirmationModalOverlay"
    );
    this.text = document.querySelector(
      "#Confirmation-confirmation #confirmationText"
    );
    this.cancelButton = document.querySelector(
      "#Confirmation-confirmation #confirmationCancel"
    );
    this.confirmButton = document.querySelector(
      "#Confirmation-confirmation #confirmationConfirm"
    );
  }

  #updateHTML() {
    if (this.text) this.text.innerText = this.message;
    if (this.cancelButton) this.cancelButton.innerText = this.cancelLabel;
    if (this.confirmButton) this.confirmButton.innerText = this.confirmLabel;
  }
  #bindEvents() {
    this.confirmButton?.addEventListener("click", () => {
      // run action
      if (this.confirmFn) {
        this.confirmFn();
      }
      //close
      this.close();
    });
    this.cancelButton?.addEventListener("click", () => {
      // run action
      if (this.cancelFn) {
        this.cancelFn();
      }
      //close
      this.close();
    });
  }
}

export default Confirmation;
