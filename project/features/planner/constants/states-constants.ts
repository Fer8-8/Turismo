export const PLAN_IMAGES = {
  oaxaca:
    "https://images.unsplash.com/photo-1530455235907-0a59ea1e04ea?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  chiapas:
    "https://images.unsplash.com/photo-1547996807-75e34d9e1e53?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  quintanaRoo:
    "https://images.unsplash.com/photo-1650927282162-8a3b284cf27a?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cXVpbnRhbmElMjByb298ZW58MHx8MHx8fDA%3D",
  jalisco:
    "https://plus.unsplash.com/premium_photo-1697730090213-59f76642099d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  bajaCaliforniaSur:
    "https://images.unsplash.com/photo-1562095241-8c6714fd4178?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  chihuahua:
    "https://plus.unsplash.com/premium_photo-1742418330690-affbc9eca693?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpaHVhaHVhJTIwZXN0YWRvfGVufDB8fDB8fHww",
  guanajuato:
    "https://images.unsplash.com/photo-1579116316943-8c5b40fa63f0?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  veracruz:
    "https://plus.unsplash.com/premium_photo-1697730089767-45e915ef27f9?q=80&w=913&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
} as const;

export type PlanImageName = keyof typeof PLAN_IMAGES;
