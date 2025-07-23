import React, { useState, useCallback } from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import InputFieldNDL from "components/Core/InputFieldNDL";
import Delete from 'assets/neo_icons/trash.svg?react';
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import Grid from 'components/Core/GridNDL';



const ShippingAddressManager = ({ onChange }) => {
    const [shippingAddresses, setShippingAddresses] = useState([
        {
            addressLine1: { value: "", isValid: true },
            addressLine2: { value: "", isValid: true },
            city: { value: "", isValid: true },
            zipCode: { value: "", isValid: true },
            country: "",
            state: "",
            isSameAsBilling: false,
        },
    ]);

    const handleAddShippingAddress = useCallback(() => {
        setShippingAddresses((prev) => {
            const updated = [
                ...prev,
                {
                    addressLine1: { value: "", isValid: true },
                    addressLine2: { value: "", isValid: true },
                    city: { value: "", isValid: true },
                    zipCode: { value: "", isValid: true },
                    country: "",
                    state: "",
                    isSameAsBilling: false,
                },
            ];
            onChange?.(updated);
            return updated;
        });
    }, [onChange]);

    const handleSwitchChange = (index) => (event) => {
        const isChecked = event.target.checked;
        const updatedAddresses = [...shippingAddresses];
    
        updatedAddresses[index].isSameAsBilling = isChecked;
    
        if (!isChecked) {
            // If unchecked, clear the fields
            updatedAddresses[index].addressLine1.value = "";
            updatedAddresses[index].addressLine2.value = "";
            updatedAddresses[index].city.value = "";
            updatedAddresses[index].state = "";
            updatedAddresses[index].zipCode.value = "";
            updatedAddresses[index].country = "";
        }
    
        setShippingAddresses(updatedAddresses);
        onChange?.(updatedAddresses);
    };
    


    const handleDeleteShippingAddress = useCallback((index) => {
        setShippingAddresses((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            onChange?.(updated);
            return updated;
        });
    }, [onChange]);

    const handleInputChange = (index, field, value) => {
        const updated = [...shippingAddresses];
        if (typeof updated[index][field] === "object") {
            updated[index][field].value = value;
        } else {
            updated[index][field] = value;
        }
        setShippingAddresses(updated);
        onChange?.(updated);
    };

    return (
        <div className="mt-4">
            {shippingAddresses.map((address, index) => (
                <div key={index} className="mb-3">
                    {/* Label and Delete Button */}
                    <div className="flex items-center gap-2">
                        <Typography
                            variant="label-01-s"
                            value={`Shipping Address ${index + 1}`}
                            color="primary"
                        />
                        <button onClick={() => handleDeleteShippingAddress(index)}>
                            <Delete className="w-5 h-5 text-red-500" />
                        </button>
                    </div>

                    {/* Switch */}
                    <Grid item xs={3} sm={3}>
                        <CustomSwitch
                            id={'Recurent'}
                            switch={false}
                            checked={address.isSameAsBilling}
                            onChange={handleSwitchChange(index)}
                            primaryLabel={'Shipping Address Same as Billing Address'}
                        />
                    </Grid>

                    {/* Address Line 1 */}
                    <div className="mt-4" />
                    <InputFieldNDL
                        label="Address Line 1"
                        placeholder="Type here"
                        value={address.addressLine1.value}
                        onChange={(e) =>
                            handleInputChange(index, "addressLine1", e.target.value)
                        }
                        className="p-2 border rounded"
                    />

                    {/* Address Line 2 */}
                    <div className="mt-4" />
                    <InputFieldNDL
                        label="Address Line 2"
                        placeholder="Type here"
                        value={address.addressLine2.value}
                        onChange={(e) =>
                            handleInputChange(index, "addressLine2", e.target.value)
                        }
                        className="p-2 border rounded"
                    />

                    {/* City and Country */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label="City"
                                placeholder="Type here"
                                value={address.city.value}
                                onChange={(e) =>
                                    handleInputChange(index, "city", e.target.value)
                                }
                                className="p-2 border rounded"
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label="Country"
                                placeholder="Type here"
                                value={address.country}
                                onChange={(e) =>
                                    handleInputChange(index, "country", e.target.value)
                                }
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* State and ZIP */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label="State"
                                placeholder="Type here"
                                value={address.state}
                                onChange={(e) =>
                                    handleInputChange(index, "state", e.target.value)
                                }
                                className="p-2 border rounded"
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label="ZIP Code"
                                placeholder="Type here"
                                value={address.zipCode.value}
                                onChange={(e) =>
                                    handleInputChange(index, "zipCode", e.target.value)
                                }
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* ➕ Add Shipping Address Under State Field */}
                    <div className="pt-4">
                        <Button
                            id="Add Shipping Address"
                            type="tertiary"
                            label="Add Shipping Address"
                            icon={Plus}
                            onClick={handleAddShippingAddress}
                            value="Add Shipping Address"
                        />
                    </div>
                </div>
            ))}
        </div>

    );
};

export default ShippingAddressManager;
