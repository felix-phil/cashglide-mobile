import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { useAppTheme } from "../../../hooks";
import { FC } from "react";

interface DotProps extends TouchableOpacityProps {
    active?: boolean;
  }
  const Dot: FC<DotProps> = ({ active = false, ...props }) => {
    const theme = useAppTheme();
    return (
      <TouchableOpacity {...props} activeOpacity={0.5}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: active
                ? theme.colors.secondary
                : theme.colors.defaults.grayTwo,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };
export default Dot
  const styles = StyleSheet.create({
    dot: {
        width: 10,
        height: 10,
        marginHorizontal: 8,
        borderRadius: 50,
      },
  })