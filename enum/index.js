const  Parameter ={
        Shipper : 1,
        Broker : 2,
        Carrier : 3
    }
    
    const  LoadUnit={
        Kilo:1,
        Tonnes:2
       
    }

    const  JourneyStatus={
        NotStarted ,
        InTransit ,
        Arrived,
        Delivered
    }
    const  ShipmentType ={
        FullContainer,
        PartContainer,
        Item
        
    }

    const  ShipperType={
        Individual,
        Company,
       

    }
    const  CarrierType={
        Air,
        Sea,
        Road
        

    }
    const  FleetType={
        Vessel,
        Truck,
        Plane


    }
    const  VesselType = {
        Cargo,
        FishingBoat,
        Tanker


    }

    const  CargoType = {   
        RoRo,
        Container,
        LiquidBulk,
        BreakBulk,
        DryBulk,
        
       

    }
    const  LoadCapacity = {

         HighCapacity:24000,
        LowCapacity:2000,
        HeavyCapacity:25000,
        
    }

    const  VehicleType ={
        SemiTrailer,
        StraightTruck,
        JumboTrailer,
        TailLiftTruck,
        TruckTrailer,
        FlatbedTruck,
        LowboyTrailer,
        RefrigeratedTrailers,
        MiniBus
    }
    const  Roles ={
        Administrator,
        AppManager,
        Carrier,
        Broker,
        Shipper,
        Auditor
    }

    const  PaymentMethod ={
        Cash : 1,
        CreditCard : 2,
        DebitCard : 3,
        Paypal: 4

    }
    const  OrderStatus ={
        OrderMade : 1,
        Proceesed : 2,
        Delivered : 3
    }

    const  Ratings  ={
        Bad : 1,
        Good : 2,
        VeryGood : 3,
        Excellent : 4,

    }