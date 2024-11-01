document.addEventListener("DOMContentLoaded", function() {
    // Initialize wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // PRODUCTS OVERVIEW PAGE LOGIC
    if (document.querySelectorAll('.product-card .wishlist-icon').length > 0) {
        document.querySelectorAll('.product-card').forEach(function(productCard) {
            const productName = productCard.getAttribute('data-name');
            const wishlistButton = productCard.querySelector('.wishlist-icon');
            const tooltip = wishlistButton.querySelector('.tooltip');

            // Set initial button state
            if (wishlist.some(item => item.name === productName)) {
                wishlistButton.classList.add('added');
                tooltip.textContent = 'Remove from Wish List';
            } else {
                tooltip.textContent = 'Add to Wish List';
            }

            // Add event listener for adding/removing from wishlist
            wishlistButton.addEventListener('click', function() {
                toggleWishlistOverview(wishlistButton, productCard);
            });
        });
    }

    // SINGLE PRODUCT PAGE LOGIC
    const singleProductCard = document.querySelector('.product-card');
    if (singleProductCard) {
        const productName = singleProductCard.getAttribute('data-name');
        const wishlistButton = singleProductCard.querySelector('.wishlist-add');

        // Set initial button state
        if (wishlist.some(item => item.name === productName)) {
            wishlistButton.textContent = 'Remove from Wish List';
            wishlistButton.classList.add('added');
        } else {
            wishlistButton.textContent = 'Add to Wish List';
            wishlistButton.classList.remove('added');
        }

        // Add event listener for adding/removing from wishlist
        wishlistButton.addEventListener('click', function() {
            toggleWishlistSingle(wishlistButton, singleProductCard);
        });
    }

    // Function to toggle add/remove from wishlist in products overview page
    function toggleWishlistOverview(element, productCard) {
        const productName = productCard.getAttribute('data-name');
        const productImg = productCard.getAttribute('data-img');
        const productPrice = productCard.getAttribute('data-price');
        const isInWishlist = wishlist.some(item => item.name === productName);
        const tooltip = element.querySelector('.tooltip');

        if (!isInWishlist) {
            wishlist.push({ name: productName, img: productImg, price: productPrice });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            element.classList.add('added');
            tooltip.textContent = 'Remove from Wish List'; // Update tooltip text
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'added' });
        } else {
            wishlist = wishlist.filter(item => item.name !== productName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            element.classList.remove('added');
            tooltip.textContent = 'Add to Wish List'; // Update tooltip text
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'removed' });
        }
    }

    // Function to toggle add/remove from wishlist in single product page
    function toggleWishlistSingle(element, productCard) {
        const productName = productCard.getAttribute('data-name');
        const productImg = productCard.getAttribute('data-img');
        const productPrice = productCard.getAttribute('data-price');
        const isInWishlist = wishlist.some(item => item.name === productName);

        if (!isInWishlist) {
            wishlist.push({ name: productName, img: productImg, price: productPrice });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            element.textContent = 'Remove from Wish List';
            element.classList.add('added');
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'added' });
        } else {
            wishlist = wishlist.filter(item => item.name !== productName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            element.textContent = 'Add to Wish List';
            element.classList.remove('added');
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'removed' });
        }
    }

    // Function to show the wishlist pop-up
    function showWishlistPopup(product) {
        const popup = document.getElementById('wishlist-popup');
        const popupContent = document.getElementById('wishlist-popup-content');
        let actionText = product.action === 'added' ? 'Added to your wishlist!' : 'Successfully removed from your wishlist!';

        if (popup && product) {
            popupContent.innerHTML = `
                <img src="${product.img}" alt="${product.name}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
                <h4>${product.name}</h4>
                <h5>${actionText}</h5>
                <button id="view-wishlist" class="wishlist-link">View Wish List</button>
                <button id="close-popup" class="wishlist-close">Close</button>
            `;

            popup.style.display = 'block';

            // Add event listener for "View Wish List" button
            document.getElementById('view-wishlist').addEventListener('click', function() {
                window.location.href = 'wishlist.html';
            });

            // Add event listener for "Close" button
            document.getElementById('close-popup').addEventListener('click', function() {
                popup.style.display = 'none';
            });
        }
    }

    // Function to update the wishlist page content
    function updateWishlistPage() {
        const wishlistItemsPage = document.getElementById('wishlist-items-page');
        if (wishlistItemsPage) {
            wishlistItemsPage.innerHTML = "";

            wishlist.forEach(function(product) {
                const listItem = document.createElement('div');
                listItem.className = 'wishlist-item';

                const imgElement = document.createElement('img');
                imgElement.src = product.img;
                imgElement.alt = product.name;
                imgElement.className = 'wishlist-item-img';
                listItem.appendChild(imgElement);

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'wishlist-item-details';
                
                const titleElement = document.createElement('div');
                titleElement.className = 'wishlist-item-title';
                titleElement.textContent = product.name;
                detailsDiv.appendChild(titleElement);
                
                const priceElement = document.createElement('div');
                priceElement.className = 'wishlist-item-price';
                priceElement.textContent = product.price;
                detailsDiv.appendChild(priceElement);

                listItem.appendChild(detailsDiv);

                const removeButton = document.createElement('button');
                removeButton.className = 'remove-button';
                removeButton.innerHTML = '✗';

                removeButton.addEventListener('click', function() {
                    removeFromWishlist(product.name);
                });

                listItem.appendChild(removeButton);
                wishlistItemsPage.appendChild(listItem);
            });
        }
    }

    // Function to remove a product from the wishlist
    function removeFromWishlist(productName) {
        wishlist = wishlist.filter(item => item.name !== productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistPage();
    }

    // Initial update of the wishlist page
    updateWishlistPage();
});
