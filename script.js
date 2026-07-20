console.log("Portfolio loaded ✅");

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = {
      fullName: contactForm.fullName.value.trim(),
      email: contactForm.email.value.trim(),
      subject: contactForm.subject.value,
      message: contactForm.message.value.trim(),
    };

    console.log(formData);

    contactForm.hidden = true;
    document.getElementById("contact-success").hidden = false;
  });
}
