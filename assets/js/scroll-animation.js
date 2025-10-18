// onDOMContentLoaded Function
// Flow:

// Select Elements: Retrieve all elements with the class animate-on-scroll and store them in animatedElements.
// Create Observer: Initialize an IntersectionObserver with a callback function (onIntersection) and a configuration object that sets the threshold to 0.1 (10%).
// Observe Elements: For each element in animatedElements, call observer.observe(element) to start monitoring its visibility.
// 2. onIntersection Function
// Flow:

// Iterate Over Entries: Loop through each entry in the entries array, which contains information about the observed elements.
// Check Visibility: For each entry, check if entry.isIntersecting is true:
// If True:
// Add Class: Add the class visible to entry.target to trigger the animation.
// Stop Observing: Call observer.unobserve(entry.target) to stop monitoring this element, preventing the animation from repeating.
// 3. main Execution Function
// Flow:

// Attach Event Listener: Use document.addEventListener("DOMContentLoaded", onDOMContentLoaded) to ensure that onDOMContentLoaded is called once the DOM is fully loaded, setting everything in motion.

document.addEventListener("DOMContentLoaded", function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once the element is visible
            }
        });
    }, {
        threshold: 0.1
    }); // Element needs to be 10% in view to trigger

    animatedElements.forEach(element => {
        observer.observe(element);
    });
});