<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Result - Food Order</title>
    <style>
        body {
            font-family: system-ui, Arial, sans-serif;
            margin: 0;
            padding: 24px;
            background-color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 500px;
            width: 100%;
            padding: 32px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .success {
            color: #28a745;
            border: 1px solid #28a745;
            background-color: #d4edda;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .error {
            color: #dc3545;
            border: 1px solid #dc3545;
            background-color: #f8d7da;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .order-details {
            text-align: left;
            margin: 20px 0;
            padding: 16px;
            background-color: #f8f9fa;
            border-radius: 6px;
        }
        
        .detail-row {
            margin: 8px 0;
            padding: 4px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        
        .back-btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        
        .back-btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Registration Status</h1>
        
        <?php
        
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "WebTech";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            echo '<div class="error">';
            echo '<h3>Database Connection Error</h3>';
            echo '<p>Sorry, we are experiencing technical difficulties. Please try again later.</p>';
            echo '</div>';
        } else {
     
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
             
                $errors = [];
                
                if (empty($_POST['fullName'])) {
                    $errors[] = "Full name is required";
                } else {
                    $fullName = trim(htmlspecialchars($_POST['fullName']));
                    if (strlen($fullName) < 2) {
                        $errors[] = "Full name must be at least 2 characters long";
                    }
                }
                
                if (empty($_POST['contactNumber'])) {
                    $errors[] = "Contact number is required";
                } else {
                    $contactNumber = trim(htmlspecialchars($_POST['contactNumber']));
                    if (!preg_match('/^\+?\d[\d\s\-]{7,}$/', $contactNumber)) {
                        $errors[] = "Please enter a valid contact number";
                    }
                }
                
                if (empty($_POST['food'])) {
                    $errors[] = "Please select a food item";
                } else {
                    $food = htmlspecialchars($_POST['food']);
                    $allowedFoods = ['pizza', 'burger', 'pasta', 'biryani', 'salad'];
                    if (!in_array($food, $allowedFoods)) {
                        $errors[] = "Invalid food selection";
                    }
                }
                
                if (empty($_POST['quantity'])) {
                    $errors[] = "Please select quantity";
                } else {
                    $quantity = (int)$_POST['quantity'];
                    if ($quantity < 1 || $quantity > 5) {
                        $errors[] = "Quantity must be between 1 and 5";
                    }
                }
                
                if (empty($_POST['payment'])) {
                    $errors[] = "Please select a payment method";
                } else {
                    $payment = htmlspecialchars($_POST['payment']);
                    $allowedPayments = ['cash', 'card', 'upi'];
                    if (!in_array($payment, $allowedPayments)) {
                        $errors[] = "Invalid payment method";
                    }
                }
                
                if (!empty($errors)) {
                    echo '<div class="error">';
                    echo '<h3>Registration Failed</h3>';
                    echo '<ul>';
                    foreach ($errors as $error) {
                        echo '<li>' . $error . '</li>';
                    }
                    echo '</ul>';
                    echo '</div>';
                } else {
                    
                    $stmt = $conn->prepare("INSERT INTO food_orders (fullName, contactNumber, food, quantity, payment, order_date) VALUES (?, ?, ?, ?, ?, NOW())");
                    $stmt->bind_param("sssis", $fullName, $contactNumber, $food, $quantity, $payment);
                    
                    if ($stmt->execute()) {
                        $orderId = $conn->insert_id;
                        echo '<div class="success">';
                        echo '<h3>🎉 Registration Successful!</h3>';
                        echo '<p>Your food order has been registered successfully.</p>';
                        echo '<p><strong>Order ID:</strong> #' . $orderId . '</p>';
                        echo '</div>';
                        
                        echo '<div class="order-details">';
                        echo '<h4>Order Details:</h4>';
                        echo '<div class="detail-row"><span class="detail-label">Name:</span> ' . $fullName . '</div>';
                        echo '<div class="detail-row"><span class="detail-label">Contact:</span> ' . $contactNumber . '</div>';
                        echo '<div class="detail-row"><span class="detail-label">Food Item:</span> ' . ucfirst($food) . '</div>';
                        echo '<div class="detail-row"><span class="detail-label">Quantity:</span> ' . $quantity . '</div>';
                        echo '<div class="detail-row"><span class="detail-label">Payment Method:</span> ' . ucfirst($payment) . '</div>';
                        echo '</div>';
                        
                        echo '<p><em>Thank you for your order! We will contact you shortly.</em></p>';
                    } else {
                        echo '<div class="error">';
                        echo '<h3>Registration Failed</h3>';
                        echo '<p>Sorry, there was an error processing your order. Please try again.</p>';
                        echo '<p><small>Error details: ' . $stmt->error . '</small></p>';
                        echo '</div>';
                    }
                    
                    $stmt->close();
                }
            } else {
                
                echo '<div class="error">';
                echo '<h3>Invalid Access</h3>';
                echo '<p>Please submit the registration form to access this page.</p>';
                echo '</div>';
            }
        }
        
        $conn->close();
        ?>
        
        <a href="index.html" class="back-btn">← Back to Registration Form</a>
    </div>
</body>
</html>