angular.module('myApp').controller('homeController', function($scope, $http) {
    //load data
    $scope.searchQuery = "";
    $scope.statusFilter = "";
    // Gọi lần đầu để load tất cả sản phẩm
    $http.get('http://localhost:3000/product/')
        .then(function(response) {
            $scope.allProducts = response.data;
            $scope.products = response.data;
        });
    
    $scope.searchProduct = function() {
        if ($scope.searchQuery) {
            const query = $scope.searchQuery.toString().toLowerCase();
            $scope.products = $scope.allProducts.filter(function(x) {
                return x.uid.toString().toLowerCase().includes(query);
            });
        } else {
            $scope.products = $scope.allProducts;
        }
    };

    //delete product
    $scope.deleteProduct = function(productId) {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        $http.delete('http://localhost:3000/product/' + productId)
            .then(function(response) {
                // Remove the deleted product from the list
                $scope.products = $scope.products.filter(function(product) {
                    return product.id !== productId;
                });
            }, function(error) {
                alert('Error deleting product:', error);
                // Optionally, you can log the error to the console for debugging
                console.error('Error deleting product:', error);
            });
    };
    $scope.filterProducts = function() {
        if ($scope.statusFilter) {
            const query = parseInt($scope.statusFilter);
            $scope.products = $scope.allProducts.filter(function(x) {
                return x.trangthai=== query;
            });
        } else {
            $scope.products = $scope.allProducts;
        }
    };
    $scope.checkFacebookUID = function(uid) {
        var url = "https://graph.facebook.com/"+uid+"/picture?redirect=false";
    
        return $http.get(url).then(function(response) {
            if (response.data && response.data.id) {
                return response.data; // UID tồn tại
            } else {
                return response.data; // Không có ID => UID không tồn tại
            }
        }, function(error) {
            return console.log(error); // UID chết, lỗi HTTP hoặc không tồn tại
        });
    };
    
    
    
    // Test sống
    $scope.checkFacebookUID("100026557990314").then(function(result) {
        console.log(result); // Kiểm tra kết quả
    });
    // Test chết
    $scope.checkFacebookUID("61562562010530").then(function(result) {
        console.log(result); // Kiểm tra kết quả
    });
    
    $scope.add = function () {
        if ($scope.addFrm.$valid) {
            var thongbao = confirm("Bạn có muốn lưu dữ liệu không?");
            if (thongbao) {
                // if($scope.products.filter(x => x.uid === $scope.add.uid).length > 0) {
                //     alert("UID đã tồn tại trong danh sách sản phẩm!");
                //     return;
                // }
                $scope.checkFacebookUID($scope.add.uid).then(function (trangthai) {
                    const data = {
                        uid: $scope.add.uid,
                        ghichu: $scope.add.ghichu,
                        trangthai: trangthai
                    };
        
                    console.log(data);
            
                    $http.post('http://localhost:3000/product', data)
                        .then(function (response) {
                            $scope.products.push(response.data);
                            $scope.add = {}; // Reset form
                            alert("Thêm thành công!");
                        }, function (error) {
                            alert('Lỗi khi thêm sản phẩm');
                        });
                });
            }
        } else {
            alert("Vui lòng nhập dữ liệu vào!");
        }
      };
      
    
      $scope.editGhichu = function(product) {
        let ghichu = prompt("Nhập ghi chú mới:", product.ghichu || "");
        if (ghichu === null) return; // Người dùng nhấn Cancel
    
        var data = {
            uid: product.uid,
            ghichu: ghichu,
            trangthai: product.trangthai
        };
    
        $http.put(`http://localhost:3000/product/${product.id}`, data)
            .then(function(response) {
                // Cập nhật thông tin sản phẩm trong danh sách
                var index = $scope.products.findIndex(p => p.id === product.id);
                if (index !== -1) {
                    $scope.products[index] = response.data;
                }
                $scope.edit = {};
                alert("Cập nhật thành công!");
            }, function(error) {
                console.error('Error updating product:', error);
                alert("Cập nhật thất bại!");
            });
    };
    
      $scope.editProduct = function(product) {
        // Sao chép thông tin sản phẩm vào form chỉnh sửa
        $scope.edit = angular.copy(product);
        // Hiển thị modal bằng Bootstrap 5 mà không cần jQuery
        var modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    };
    
    $scope.update = function() {
        if ($scope.editFrm.$valid) {
            var thongbao = confirm("Bạn có muốn lưu thay đổi?");
            if (thongbao == true) {
                // Kiểm tra UID trước khi chỉnh sửa
                $scope.checkFacebookUID($scope.edit.uid).then(function(trangthai) {
                    
                    var data = {
                        uid: $scope.edit.uid,
                        ghichu: $scope.edit.ghichu,
                        trangthai: trangthai // Trạng thái đã được chỉnh sửa
                    };
                    
                    // Gửi yêu cầu PUT để cập nhật thông tin sản phẩm
                    $http.put(`http://localhost:3000/product/${$scope.edit.id}`, data)
                        .then(function(response) {
                            // Cập nhật thông tin sản phẩm trong danh sách
                            var index = $scope.products.findIndex(p => p.id === $scope.edit.id);
                            if (index !== -1) {
                                $scope.products[index] = response.data; // Cập nhật thông tin sản phẩm
                            }
                            $scope.edit = {}; // Reset form
                            
                            // Đóng modal bằng Bootstrap 5 mà không cần jQuery
                            var modal = new bootstrap.Modal(document.getElementById('editModal'));
                            modal.hide(); // Đóng modal
    
                            alert("Cập nhật thành công!");
                        }, function(error) {
                            alert('Error updating product:', error);
                        });
                });
            }
        } else {
            alert("Vui lòng nhập dữ liệu hợp lệ!");
        }
    };
    
    $scope.loadData = function() {
        // Kiểm tra nếu $scope.products là undefined hoặc không phải là mảng
        if (!Array.isArray($scope.products)) {
            $scope.products = []; // Gán mảng rỗng nếu không phải mảng
        }
    
        const promises = $scope.products.map(function(x) {
            return $scope.checkFacebookUID(x.uid).then(function(trangthai) {
    
                var data = {
                    uid: x.uid,
                    ghichu: x.ghichu,
                    trangthai: trangthai // Cập nhật trạng thái
                };
    
                return $http.put(`http://localhost:3000/product/${x.id}`, data);
            });
        });
    
        Promise.all(promises)
            .then(function() {
                console.log('Cập nhật thành công cho tất cả sản phẩm.');
            })
            .catch(function(error) {
                console.error('Có lỗi khi cập nhật sản phẩm:', error);
            });
    };
    
});
