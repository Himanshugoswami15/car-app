// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarRental {

    address public owner;
    uint256 public rentalPrice;
    uint256 public lateFeePerDay;

    enum CarStatus { Available, Booked }

    struct Car {
        uint256 id;
        CarStatus status;
    }

    struct Booking {
        address renter;
        uint256 carId;
        uint256 startDate;
        uint256 endDate;
        uint256 amountPaid;
    }

    Car[] public cars;
    mapping(address => Booking) public bookings;
    mapping(uint256 => address) public carIdToRenter;

    event CarAdded(uint256 carId);
    event Booked(address indexed renter, uint256 carId, uint256 startDate, uint256 endDate);
    event Returned(address indexed renter, uint256 carId);
    event LateFeePaid(address indexed renter, uint256 amount);
    event Received(address sender, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier carAvailable(uint256 _carId) {
        require(cars[_carId].status == CarStatus.Available, "Car is currently rented out");
        _;
    }

    constructor(uint256 _rentalPrice, uint256 _lateFeePerDay) {
        owner = msg.sender;
        rentalPrice = _rentalPrice;
        lateFeePerDay = _lateFeePerDay;
    }

    function addCar() external onlyOwner {
        uint256 carId = cars.length;
        cars.push(Car({
            id: carId,
            status: CarStatus.Available
        }));
        emit CarAdded(carId);
    }

    function bookCar(uint256 _carId, uint256 _days) external payable carAvailable(_carId) {
        require(msg.value == _days * rentalPrice, "Incorrect ether sent");

        cars[_carId].status = CarStatus.Booked;
        carIdToRenter[_carId] = msg.sender;

        bookings[msg.sender] = Booking({
            renter: msg.sender,
            carId: _carId,
            startDate: block.timestamp,
            endDate: block.timestamp + _days * 1 days,
            amountPaid: msg.value
        });

        emit Booked(msg.sender, _carId, bookings[msg.sender].startDate, bookings[msg.sender].endDate);
    }

    function returnCar(uint256 _carId) external payable {
        require(cars[_carId].status == CarStatus.Booked, "Car is not booked");
        require(bookings[msg.sender].renter == msg.sender, "Only the current renter can return the car");

        uint256 fee = calculateLateFee(msg.sender);

        if(fee > 0) {
            require(msg.value == fee, "Incorrect late fee sent");
            payable(owner).transfer(fee);
            emit LateFeePaid(msg.sender, fee);
        } else {
            require(msg.value == 0, "No fee is required");
        }

        cars[_carId].status = CarStatus.Available;
        delete carIdToRenter[_carId];
        delete bookings[msg.sender];
        emit Returned(msg.sender, _carId);
    }

    function calculateLateFee(address _renter) public view returns (uint256) {
        if(block.timestamp <= bookings[_renter].endDate) {
            return 0;
        }
        uint256 daysLate = (block.timestamp - bookings[_renter].endDate) / 1 days;
        return daysLate * lateFeePerDay;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
        emit Received(msg.sender, balance);
    }

    function setRentalPrice(uint256 _rentalPrice) external onlyOwner {
        rentalPrice = _rentalPrice;
    }

    function setLateFee(uint256 _lateFeePerDay) external onlyOwner {
        lateFeePerDay = _lateFeePerDay;
    }
}
