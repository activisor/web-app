import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { publicRuntimeConfig } from '@/lib/app-constants';
import { readItem, saveItem, REFERRAL } from '@/client-lib/local-storage';

// Renders errors or successfull transactions on the screen.
interface MessageProps {
    content: string;
}

const Message: React.FC<MessageProps> = (props) => {
    return <p>{props.content}</p>;
};

export interface CheckoutProps {
    clientId: string;
    referral: boolean;
    onSuccess: () => void;
    onFailure: () => void;
};

interface CreateOrderProps {
    referral: boolean;
}

const Checkout: React.FC<CheckoutProps> = (props) => {
    const initialOptions = {
        clientId: props.clientId,
        currency: publicRuntimeConfig.CURRENCY,
        intent: "capture",
        enableFunding: "venmo,card,credit",
        disableFunding: "paylater",
        dataSdkIntegrationSource: "integrationbuilder_sc",
    };

    const [message, setMessage] = useState("");

    // rerender createOrder when referral changes
    useEffect(() => {
        saveItem(REFERRAL, props.referral);
    }, [props.referral]);

    return (
        <div className="App">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "rect",
                        layout: "vertical",
                    }}
                    createOrder={async () => {
                        try {
                            const response = await fetch("/api/orders", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                // use the "body" param to optionally pass additional order information
                                // like product ids and quantities
                                body: JSON.stringify({
                                    cart: {
                                        id: "1",
                                        referral: readItem(REFERRAL)
                                    },
                                }),
                        });

                const orderData = await response.json();

                if (orderData.id) {
                                return orderData.id;
                            } else {
                                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

                throw new Error(errorMessage);
                            }
                        } catch (error) {
                    console.error(error);
                setMessage(`Could not initiate PayPal Checkout...${error}`);
                        }
                    }}
                onApprove={async (data, actions) => {
                    try {
                        const response = await fetch(
                            `/api/orders/${data.orderID}/capture`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            },
                        );

                        const orderData = await response.json();
                        // Three cases to handle:
                        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                        //   (2) Other non-recoverable errors -> Show a failure message
                        //   (3) Successful transaction -> Show confirmation or thank you message
                        const errorDetail = orderData?.details?.[0];

                        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                            return actions.restart();
                        } else if (errorDetail) {
                            // (2) Other non-recoverable errors -> Show a failure message
                            throw new Error(
                                `${errorDetail.description} (${orderData.debug_id})`,
                            );
                        } else {
                            // (3) Successful transaction -> Show confirmation or thank you message
                            const transaction = orderData.purchase_units[0].payments.captures[0];
                            setMessage(
                                `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
                            );
                            /*
                            console.log(
                                "Capture result",
                                orderData,
                                JSON.stringify(orderData, null, 2),
                            );
                            */
                            props.onSuccess();
                        }
                    } catch (error) {
                        // console.error(error);
                        setMessage(
                            `Sorry, your transaction could not be processed...${error}`,
                        );
                    }
                }}
                />
            </PayPalScriptProvider>
            <Message content={message} />
        </div>
    );
};

export default Checkout;
