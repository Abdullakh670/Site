
$(document).ready(function() {
    
    // ============================================
    // 1. COUNTDOWN TIMER (Home Page)
    // ============================================
    if ($('#timer').length) {
        // Set target date (e.g. 7 days from now)
        let targetDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); 
        
        setInterval(function() {
            let now = new Date().getTime();
            let diff = targetDate - now;
            
            // Math.floor used to drop decimals
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            $('#days').text(days < 10 ? '0' + days : days);
            $('#hours').text(hours < 10 ? '0' + hours : hours);
            $('#mins').text(mins < 10 ? '0' + mins : mins);
            $('#secs').text(secs < 10 ? '0' + secs : secs);
        }, 1000);
    }

    // ============================================
    // 2. STATISTICS COUNTER ANIMATION (Home Page)
    // ============================================
    if ($('.stats-section').length) {
        let animated = false;
        
        $(window).scroll(function() {
            let topOfWindow = $(window).scrollTop();
            let topOfSection = $('.stats-section').offset().top - window.innerHeight + 150;
            
            if (topOfWindow > topOfSection && !animated) {
                $('.stat-number').each(function() {
                    let $this = $(this);
                    let target = $this.data('target');
                    
                    $({ count: 0 }).animate({ count: target }, {
                        duration: 2500,
                        easing: 'swing',
                        step: function() { 
                            $this.text(Math.ceil(this.count)); 
                        },
                        complete: function() { 
                            $this.text(target); 
                        }
                    });
                });
                animated = true;
            }
        });
    }

    // ============================================
    // 3. TABLE FILTERING (Matches Page)
    // ============================================
    $('.filter-btn').click(function() {
        // Toggle Active Classes
        $('.filter-btn').removeClass('active btn-primary').addClass('btn-outline-primary');
        $(this).addClass('active btn-primary').removeClass('btn-outline-primary');
        
        let filter = $(this).data('filter');
        
        if (filter === 'all') {
            $('.match-row').show(); // Show all
        } else {
            $('.match-row').hide(); // Hide all first
            $('.match-row.' + filter).show(); // Show matched
        }
    });

    // ============================================
    // 4. FORM VALIDATION (Regex + preventDefault)
    // ============================================
    $('#ticketForm').submit(function(e) {
        e.preventDefault(); // Stop page reload
        let valid = true;
        
        // Match Select Check
        if ($('#matchSelect').val() === "") {
            $('#matchSelect').addClass('is-invalid');
            valid = false;
        } else {
            $('#matchSelect').removeClass('is-invalid');
        }

        // Name Check
        if ($('#name').val().trim() === "") {
            $('#name').addClass('is-invalid');
            valid = false;
        } else {
            $('#name').removeClass('is-invalid');
        }

        // Email Check (Regex)
        let email = $('#email').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#email').addClass('is-invalid');
            valid = false;
        } else {
            $('#email').removeClass('is-invalid');
        }

        // Phone Check (Regex: +7 777 123 4567)
        let phone = $('#phone').val();
        let phoneRegex = /^\+7 \d{3} \d{3} \d{4}$/; 
        if (!phoneRegex.test(phone)) {
            $('#phone').addClass('is-invalid');
            valid = false;
        } else {
            $('#phone').removeClass('is-invalid');
        }
        
        // Success Action
        if (valid) {
            this.reset(); // Clear form
            
            // jQuery SlideDown animation
            $('#successMsg').slideDown().delay(4000).slideUp();
        }
    });
});
