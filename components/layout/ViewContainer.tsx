// import React from "react";
// import { View, StyleSheet, SafeAreaView } from "react-native";

// type ViewContainerProps = {
//     children: React.ReactNode;
//     style?: object;
// };

// const ViewContainer: React.FC<ViewContainerProps> = ({ children, style }) => {
//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={[styles.container, style]}>{children}</View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: "white", // Change to your theme color if needed
//     },
//     container: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingTop: 16,
//     },
// });

// export default ViewContainer;
import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";

type ViewContainerProps = {
    children: React.ReactNode;
    style?: object;
    scrollable?: boolean; // Add scrollable prop
};

const ViewContainer: React.FC<ViewContainerProps> = ({ children, style, scrollable }) => {
    const content = (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {scrollable ? (
                <ScrollView contentContainerStyle={styles.scrollableContainer}>
                    {content}
                </ScrollView>
            ) : (
                content
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white", // Change to your theme color if needed
    },
    container: {
        flex: 1,
        flexGrow: 1, // Ensures that ScrollView can grow with content
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    scrollableContainer: {
        flexGrow: 1, // Ensures that ScrollView can grow with content
    },
});

export default ViewContainer;
